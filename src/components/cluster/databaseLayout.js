// Deterministic three-column layout for the database map:
//
//   apps  ->  databases  ->  what each database depends on
//                            (machines, storage, backup targets)
//
// Pure: same input, same positions. Returns node boxes and the edges between
// them; the component only draws.

import { humanize } from './networkStyles';

export const RELATIONS = {
  USES: { label: 'App uses database' },
  PLACEMENT: { label: 'Runs on' },
  STORAGE: { label: 'Storage' },
  BACKUP: { label: 'Backup' },
};

const STORAGE_LABELS = {
  MAYASTOR: 'Mayastor volumes',
  LVM_LOCAL: 'Node-local volumes',
  HOST_DISK: 'Server disks',
  NONE: 'No persistent storage',
  EXTERNAL: 'External',
};

const BACKUP_LABELS = {
  GARAGE: 'Garage S3',
  BACKBLAZE_B2: 'Backblaze B2',
  VOLUME_SNAPSHOT: 'Volume snapshots',
};

export const WIDTH = 1100;
const PAD_TOP = 44;
const PAD_BOTTOM = 20;
const NODE_H = 40;
const GROUP_GAP = 30;

const COLUMNS = {
  app: { x: 16, w: 200 },
  database: { x: 420, w: 250 },
  target: { x: 874, w: 210 },
};

const isVelero = (backup) => /^velero\b/i.test(backup.name || '');

// Worst backup status first, so one stale backup is not hidden by a fresh one.
const BACKUP_SEVERITY = { OFFLINE: 2, UNKNOWN: 1, HEALTHY: 0 };

function stack(items, column, height) {
  const pitch = Math.min(56, (height - PAD_TOP - PAD_BOTTOM) / Math.max(items.length, 1));
  return items.map((item, i) => ({
    ...item,
    x: COLUMNS[column].x,
    y: PAD_TOP + i * pitch + (pitch - NODE_H) / 2,
    w: COLUMNS[column].w,
    h: NODE_H,
  }));
}

function stackGroups(groups, height) {
  const count = groups.reduce((n, g) => n + g.items.length, 0);
  const gaps = (groups.length - 1) * GROUP_GAP;
  const pitch = Math.min(56, (height - PAD_TOP - PAD_BOTTOM - gaps) / Math.max(count, 1));
  const out = [];
  let row = 0;
  groups.forEach((group, g) => {
    group.items.forEach((item, i) => {
      out.push({
        ...item,
        group: i === 0 ? group.title : null,
        x: COLUMNS.target.x,
        y: PAD_TOP + row * pitch + g * GROUP_GAP + (pitch - NODE_H) / 2,
        w: COLUMNS.target.w,
        h: NODE_H,
      });
      row += 1;
    });
  });
  return out;
}

export default function layoutDatabases(topology) {
  const apps = topology?.apps ?? [];
  const databases = topology?.databases ?? [];

  const machines = new Map();
  const storage = new Map();
  const backups = new Map();
  const edges = [];

  for (const app of apps) {
    for (const dbId of app.databases) {
      edges.push({ source: `app:${app.id}`, target: `db:${dbId}`, relation: 'USES' });
    }
  }

  for (const db of databases) {
    const seen = new Set();
    for (const inst of db.instances) {
      const key = inst.machineId ?? 'unknown';
      if (!machines.has(key)) machines.set(key, { id: `machine:${key}`, label: inst.machineName });
      // One edge per machine; it is the primary's edge if the primary is there.
      const edgeId = `machine:${key}`;
      const existing = edges.find((e) => e.source === `db:${db.id}` && e.target === edgeId);
      if (existing) {
        existing.primary = existing.primary || inst.role === 'PRIMARY';
        existing.ready = existing.ready && inst.ready;
      } else if (!seen.has(key)) {
        seen.add(key);
        edges.push({
          source: `db:${db.id}`,
          target: edgeId,
          relation: 'PLACEMENT',
          primary: inst.role === 'PRIMARY',
          ready: inst.ready,
        });
      }
    }

    if (!storage.has(db.storage)) {
      storage.set(db.storage, {
        id: `storage:${db.storage}`,
        label: STORAGE_LABELS[db.storage] ?? humanize(db.storage),
      });
    }
    edges.push({ source: `db:${db.id}`, target: `storage:${db.storage}`, relation: 'STORAGE' });

    // Velero copies get their own boxes: they are a different mechanism (a
    // file-level copy of the volume) from the database's own backups, even
    // when both end up in the same place.
    const byTarget = new Map();
    for (const backup of db.backups) {
      const key = isVelero(backup) ? `VELERO_${backup.target}` : backup.target;
      const worst = byTarget.get(key)?.status;
      if (!worst || BACKUP_SEVERITY[backup.status] > BACKUP_SEVERITY[worst]) {
        byTarget.set(key, {
          status: backup.status,
          target: backup.target,
          velero: isVelero(backup),
        });
      }
    }
    for (const [key, { status, target, velero }] of byTarget) {
      if (!backups.has(key)) {
        const place = BACKUP_LABELS[target] ?? humanize(target);
        backups.set(key, { id: `backup:${key}`, label: velero ? `Velero \u2192 ${place}` : place });
      }
      edges.push({ source: `db:${db.id}`, target: `backup:${key}`, relation: 'BACKUP', status });
    }
  }

  const sortByLabel = (map) => [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  const groups = [
    { title: 'MACHINES', items: sortByLabel(machines).map((m) => ({ ...m, kind: 'machine' })) },
    { title: 'STORAGE', items: sortByLabel(storage).map((s) => ({ ...s, kind: 'storage' })) },
    { title: 'BACKUPS', items: sortByLabel(backups).map((b) => ({ ...b, kind: 'backup' })) },
  ].filter((g) => g.items.length > 0);

  const targetCount = groups.reduce((n, g) => n + g.items.length, 0);
  const rows = Math.max(apps.length, databases.length, targetCount);
  const height = PAD_TOP + PAD_BOTTOM + rows * 56;

  const nodes = [
    ...stack(
      apps.map((a) => ({ id: `app:${a.id}`, label: a.displayName, kind: 'app' })),
      'app',
      height
    ),
    ...stack(
      databases.map((d) => ({
        id: `db:${d.id}`,
        label: d.displayName,
        kind: 'database',
        database: d,
      })),
      'database',
      height
    ),
    ...stackGroups(groups, height),
  ];

  return { width: WIDTH, height, nodes, edges };
}

// Ids of every node reachable from `id` through its own edges: an app lights
// up its databases and everything those depend on; a database lights up its
// apps and dependencies; a target lights up its databases and their apps.
export function connectedTo(id, edges) {
  if (!id) return null;
  const out = new Set([id]);
  const dbs = new Set();
  if (id.startsWith('db:')) dbs.add(id);
  for (const e of edges) {
    if (e.source === id && e.target.startsWith('db:')) dbs.add(e.target);
    if (e.target === id && e.source.startsWith('db:')) dbs.add(e.source);
  }
  for (const e of edges) {
    if (dbs.has(e.source) || dbs.has(e.target)) {
      const direct = e.source === id || e.target === id;
      // From an app or a target, only follow through to the far side.
      if (id.startsWith('db:') || direct || !sameSide(id, e)) {
        out.add(e.source);
        out.add(e.target);
      }
    }
  }
  return out;
}

function sameSide(id, edge) {
  const other = edge.source.startsWith('db:') ? edge.target : edge.source;
  const side = (x) => (x.startsWith('app:') ? 'app' : 'target');
  return side(other) === side(id) && other !== id;
}
