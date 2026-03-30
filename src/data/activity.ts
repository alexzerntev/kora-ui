/**
 * Activity feed — recent events across the platform.
 * Seeded with realistic historical events; real-time events
 * are appended by the MockDataProvider's subscribe() mechanism.
 */

export interface ActivityEntry {
  id: string
  text: string
  type: 'completed' | 'started' | 'failed' | 'assigned'
  timestamp: string // ISO 8601
}

export const ACTIVITY_FEED: ActivityEntry[] = [
  {
    id: 'act-1',
    text: 'Lead Processing Pipeline completed successfully',
    type: 'completed',
    timestamp: '2026-03-30T06:42:00Z',
  },
  {
    id: 'act-2',
    text: 'Lead Processing Pipeline failed at "Fetch CRM Data" — connection timeout',
    type: 'failed',
    timestamp: '2026-03-30T07:38:00Z',
  },
  {
    id: 'act-3',
    text: 'Alice Chen started Client Onboarding for Acme Corp',
    type: 'started',
    timestamp: '2026-03-30T09:00:00Z',
  },
  {
    id: 'act-4',
    text: 'Nora completed Market Research — Q4 Report',
    type: 'completed',
    timestamp: '2026-03-30T08:30:00Z',
  },
  {
    id: 'act-5',
    text: 'Felix assigned to Draft Q4 Summary Report',
    type: 'assigned',
    timestamp: '2026-03-30T09:15:00Z',
  },
  {
    id: 'act-6',
    text: 'Mira completed review of Vendor Contracts',
    type: 'completed',
    timestamp: '2026-03-29T16:00:00Z',
  },
  {
    id: 'act-7',
    text: 'Bob Martinez assigned to compliance review',
    type: 'assigned',
    timestamp: '2026-03-30T08:45:00Z',
  },
  {
    id: 'act-8',
    text: 'Lead Processing Pipeline started via webhook',
    type: 'started',
    timestamp: '2026-03-30T08:15:00Z',
  },
]
