import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuery, useSubscription } from '@apollo/client/react';
import { RECENT_AI_EVENTS_QUERY, AI_EVENT_SUBSCRIPTION } from '../graphql/gateway';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FeedContainer = styled.div`
  max-height: 520px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EventCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 14px 18px;
  animation: ${slideIn} 0.3s ease;
  transition: border-color 0.2s ease;

  .dark-mode & {
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(30, 30, 50, 0.9) 100%);
  }

  &:hover {
    border-color: var(--primary-color);
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const EventEndpoint = styled.span`
  font-weight: 700;
  font-size: 13px;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EventTime = styled.span`
  font-size: 12px;
  color: var(--text-muted-color);
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  color: #fff;
  background: ${(p) => p.bg || '#666'};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted-color);
  font-size: 15px;
`;

const statusColors = { success: '#48bb78', error: '#f56565' };
const appColors = {
  bookmarks: '#9c27b0',
  'code-talk': '#1976d2',
  educationelly: '#f57c00',
  intervalai: '#0288d1',
  firebook: '#d32f2f',
  general: '#607d8b',
};

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function AIEventFeed() {
  const [events, setEvents] = useState([]);

  const { data: recentData } = useQuery(RECENT_AI_EVENTS_QUERY);
  const { data: subData } = useSubscription(AI_EVENT_SUBSCRIPTION);

  useEffect(() => {
    if (recentData?.recentAIEvents) {
      setEvents([...recentData.recentAIEvents].reverse());
    }
  }, [recentData]);

  useEffect(() => {
    if (subData?.aiEventStream) {
      setEvents((prev) => [subData.aiEventStream, ...prev].slice(0, 50));
    }
  }, [subData]);

  return events.length === 0 ? (
    <EmptyText>Waiting for AI events...</EmptyText>
  ) : (
    <FeedContainer>
      {events.map((ev) => (
        <EventCard key={ev.eventId}>
          <EventHeader>
            <EventEndpoint>{ev.endpoint}</EventEndpoint>
            <EventTime>{timeAgo(ev.timestamp)}</EventTime>
          </EventHeader>
          <BadgeRow>
            <Badge bg={appColors[ev.app] || '#666'}>{ev.app}</Badge>
            <Badge bg={statusColors[ev.status]}>{ev.status}</Badge>
            <Badge bg="#555">{ev.backend}</Badge>
            <Badge bg="#777">{Math.round(ev.latencyMs)}ms</Badge>
            {ev.fromCache && <Badge bg="#d4a017">cached</Badge>}
            {ev.model && (
              <Badge bg="#888">
                {ev.model.length > 25 ? `${ev.model.substring(0, 25)}...` : ev.model}
              </Badge>
            )}
          </BadgeRow>
        </EventCard>
      ))}
    </FeedContainer>
  );
}
