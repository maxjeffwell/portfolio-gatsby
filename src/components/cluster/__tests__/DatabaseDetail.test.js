import { backupText } from '../DatabaseDetail';

const now = Date.UTC(2026, 10, 20, 12);
const ago = (hours) => new Date(now - hours * 3600000).toISOString();

describe('backupText', () => {
  it('describes fresh backups by age', () => {
    expect(backupText({ status: 'HEALTHY', lastSuccess: ago(0.2) }, now)).toBe('under 1h ago');
    expect(backupText({ status: 'HEALTHY', lastSuccess: ago(7) }, now)).toBe('7h ago');
    expect(backupText({ status: 'HEALTHY', lastSuccess: ago(120) }, now)).toBe('5d ago');
  });

  it('flags overdue backups and says when there is no monitoring signal', () => {
    expect(backupText({ status: 'OFFLINE', lastSuccess: ago(72) }, now)).toBe(
      'overdue, last 3d ago'
    );
    expect(backupText({ status: 'UNKNOWN', lastSuccess: null }, now)).toBe('not monitored');
  });
});
