import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS, healthColorFor } from './networkStyles';

const Card = styled.div`
  background: rgba(13, 18, 32, 0.9);
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
  padding: 16px;
  font-size: 12px;
  min-height: 120px;
`;

const Title = styled.h3`
  color: ${COLORS.green};
  font-size: 14px;
  margin: 0 0 4px;
`;

const Meta = styled.div`
  color: ${COLORS.muted};
  font-size: 11px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.div`
  color: ${COLORS.muted};
  font-size: 10px;
  letter-spacing: 1.5px;
  margin: 14px 0 6px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 1px solid ${COLORS.border};
`;

const Dot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${(props) => props.$color};
`;

const Value = styled.span`
  color: ${(props) => props.$color || COLORS.text};
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
`;

const STORAGE_TEXT = {
  MAYASTOR: 'Mayastor volumes (replicated across servers)',
  LVM_LOCAL: 'Node-local volumes (one per instance)',
  HOST_DISK: 'Server disks (outside Kubernetes)',
  NONE: 'None: a cache that keeps nothing across restarts',
  EXTERNAL: 'Hosted by the provider, outside the cluster',
};

// Why a store has no backups listed, where the reason is known.
const NO_BACKUP_TEXT = {
  NONE: 'Not backed up (nothing to keep)',
  EXTERNAL: 'Kept by the provider; no backup is taken from this cluster',
};

const TARGET_TEXT = {
  GARAGE: 'Garage S3',
  BACKBLAZE_B2: 'Backblaze B2',
  VOLUME_SNAPSHOT: 'Volume snapshot',
};

const BACKUP_COLORS = { HEALTHY: COLORS.green, OFFLINE: COLORS.red, UNKNOWN: COLORS.gray };

export function backupText(backup, now = Date.now()) {
  if (backup.status === 'UNKNOWN' || !backup.lastSuccess) return 'not monitored';
  const hours = Math.max(0, (now - new Date(backup.lastSuccess).getTime()) / 3600000);
  let age = `${Math.round(hours / 24)}d ago`;
  if (hours < 1) age = 'under 1h ago';
  else if (hours < 48) age = `${Math.round(hours)}h ago`;
  return backup.status === 'OFFLINE' ? `overdue, last ${age}` : age;
}

export default function DatabaseDetail({ database, apps }) {
  if (!database) {
    return (
      <Card>
        <Meta>
          Hover anything to trace its connections. Select a database for its instances, storage and
          backups.
        </Meta>
      </Card>
    );
  }

  const usedBy = apps.filter((app) => app.databases.includes(database.id));
  const ready = database.instances.filter((i) => i.ready).length;
  const hosted = database.storage === 'EXTERNAL';

  return (
    <Card>
      <Title>{database.displayName}</Title>
      <Meta>
        {database.engine} &middot; {database.manager} &middot;{' '}
        {hosted ? (
          <Value $color={COLORS.gray}>NOT MONITORED</Value>
        ) : (
          <Value $color={healthColorFor(database.health)}>{database.health}</Value>
        )}
      </Meta>

      <SectionTitle>
        {hosted ? 'INSTANCES' : `INSTANCES (${ready}/${database.expectedInstances} READY)`}
      </SectionTitle>
      {hosted && (
        <Row>
          <span>A hosted service: nothing runs in this cluster</span>
        </Row>
      )}
      {database.instances.map((inst) => (
        <Row key={inst.name}>
          <span>
            <Dot $color={inst.ready ? COLORS.green : COLORS.red} />
            {inst.role}
          </span>
          <Value>{inst.machineName}</Value>
        </Row>
      ))}

      <SectionTitle>STORAGE</SectionTitle>
      <Row>
        <span>{STORAGE_TEXT[database.storage] || database.storage}</span>
      </Row>

      <SectionTitle>BACKUPS</SectionTitle>
      {database.backups.length === 0 && (
        <Row>
          <span>{NO_BACKUP_TEXT[database.storage] || 'Not backed up'}</span>
        </Row>
      )}
      {database.backups.map((backup) => (
        <Row key={`${backup.name}-${backup.target}`}>
          <span>
            <Dot $color={BACKUP_COLORS[backup.status]} />
            {backup.name} &rarr; {TARGET_TEXT[backup.target] || backup.target}
          </span>
          <Value $color={BACKUP_COLORS[backup.status]}>{backupText(backup)}</Value>
        </Row>
      ))}

      <SectionTitle>USED BY</SectionTitle>
      {usedBy.length === 0 && (
        <Row>
          <span>No application points at this database</span>
        </Row>
      )}
      {usedBy.map((app) => (
        <Row key={app.id}>
          <span>{app.displayName}</span>
        </Row>
      ))}
    </Card>
  );
}

DatabaseDetail.propTypes = {
  database: PropTypes.shape({}),
  apps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

DatabaseDetail.defaultProps = { database: null };
