import layoutDatabases, { connectedTo } from '../databaseLayout';

const topology = {
  apps: [
    { id: 'a', displayName: 'App A', databases: ['one'] },
    { id: 'b', displayName: 'App B', databases: ['one', 'two'] },
  ],
  databases: [
    {
      id: 'one',
      displayName: 'One',
      storage: 'MAYASTOR',
      instances: [
        { role: 'PRIMARY', machineId: 'cp-1', machineName: 'Control Plane 1', ready: true },
        { role: 'REPLICA', machineId: 'cp-2', machineName: 'Control Plane 2', ready: true },
      ],
      backups: [
        { target: 'BACKBLAZE_B2', status: 'HEALTHY' },
        { target: 'BACKBLAZE_B2', status: 'OFFLINE' },
      ],
    },
    {
      id: 'two',
      displayName: 'Two',
      storage: 'LVM_LOCAL',
      instances: [
        { role: 'MEMBER', machineId: 'cp-2', machineName: 'Control Plane 2', ready: false },
        { role: 'MEMBER', machineId: 'cp-2', machineName: 'Control Plane 2', ready: true },
      ],
      backups: [{ target: 'GARAGE', status: 'UNKNOWN' }],
    },
  ],
};

describe('layoutDatabases', () => {
  const { nodes, edges, height } = layoutDatabases(topology);
  const ids = nodes.map((n) => n.id);

  it('creates one node per app, database, machine, storage kind and backup target', () => {
    expect(ids).toEqual(
      expect.arrayContaining([
        'app:a',
        'app:b',
        'db:one',
        'db:two',
        'machine:cp-1',
        'machine:cp-2',
        'storage:MAYASTOR',
        'storage:LVM_LOCAL',
        'backup:BACKBLAZE_B2',
        'backup:GARAGE',
      ])
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps every node inside the canvas and never overlaps nodes in a column', () => {
    const columns = {};
    nodes.forEach((n) => {
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y + n.h).toBeLessThanOrEqual(height);
      (columns[n.x] = columns[n.x] || []).push(n);
    });
    Object.values(columns).forEach((col) => {
      col.sort((a, b) => a.y - b.y);
      for (let i = 1; i < col.length; i += 1) {
        expect(col[i].y).toBeGreaterThanOrEqual(col[i - 1].y + col[i - 1].h);
      }
    });
  });

  it('draws one placement edge per machine, marks the primary, and shows the worst backup', () => {
    const placement = edges.filter((e) => e.relation === 'PLACEMENT');
    expect(placement).toHaveLength(3);
    expect(
      placement.find((e) => e.source === 'db:one' && e.target === 'machine:cp-1').primary
    ).toBe(true);
    expect(placement.find((e) => e.source === 'db:two').ready).toBe(false);

    const backup = edges.filter((e) => e.relation === 'BACKUP' && e.source === 'db:one');
    expect(backup).toHaveLength(1);
    expect(backup[0].status).toBe('OFFLINE');
  });

  it('tolerates no data', () => {
    expect(layoutDatabases(null).nodes).toEqual([]);
  });
});

describe('connectedTo', () => {
  const { edges } = layoutDatabases(topology);

  it('follows an app through its databases to what they depend on, not to other apps', () => {
    const set = connectedTo('app:a', edges);
    expect(set.has('db:one')).toBe(true);
    expect(set.has('machine:cp-1')).toBe(true);
    expect(set.has('db:two')).toBe(false);
    expect(set.has('app:b')).toBe(false);
  });

  it('follows a target back to its databases and their apps, not to other targets', () => {
    const set = connectedTo('storage:LVM_LOCAL', edges);
    expect(set.has('db:two')).toBe(true);
    expect(set.has('app:b')).toBe(true);
    expect(set.has('db:one')).toBe(false);
    expect(set.has('backup:GARAGE')).toBe(false);
  });

  it('lights up everything around a database, and nothing when there is no selection', () => {
    const set = connectedTo('db:two', edges);
    expect([...set].sort()).toEqual(
      ['app:b', 'backup:GARAGE', 'db:two', 'machine:cp-2', 'storage:LVM_LOCAL'].sort()
    );
    expect(connectedTo(null, edges)).toBeNull();
  });
});

describe('backup boxes', () => {
  const db = (backups, storage = 'MAYASTOR') => ({
    apps: [],
    databases: [{ id: 'x', displayName: 'X', storage, instances: [], backups }],
  });

  it('gives Velero copies their own boxes, separate from other backups to the same place', () => {
    const { nodes, edges } = layoutDatabases(
      db([
        { name: 'Base backup + WAL archive', target: 'BACKBLAZE_B2', status: 'HEALTHY' },
        { name: 'Velero weekly off-site copy', target: 'BACKBLAZE_B2', status: 'OFFLINE' },
        { name: 'Velero daily volume copy', target: 'GARAGE', status: 'HEALTHY' },
      ])
    );
    const labels = Object.fromEntries(nodes.map((n) => [n.id, n.label]));
    expect(labels['backup:BACKBLAZE_B2']).toBe('Backblaze B2');
    expect(labels['backup:VELERO_BACKBLAZE_B2']).toBe('Velero \u2192 Backblaze B2');
    expect(labels['backup:VELERO_GARAGE']).toBe('Velero \u2192 Garage S3');

    const status = (target) => edges.find((e) => e.target === target).status;
    expect(status('backup:BACKBLAZE_B2')).toBe('HEALTHY');
    expect(status('backup:VELERO_BACKBLAZE_B2')).toBe('OFFLINE');
  });

  it('labels external storage, and makes a readable label for a value it does not know', () => {
    const label = (storage) =>
      layoutDatabases(db([], storage)).nodes.find((n) => n.id === `storage:${storage}`).label;
    expect(label('EXTERNAL')).toBe('External');
    expect(label('SOME_NEW_KIND')).toBe('Some new kind');
  });
});
