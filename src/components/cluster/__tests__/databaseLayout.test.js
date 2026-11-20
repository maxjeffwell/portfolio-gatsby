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
