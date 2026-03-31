import { useState, useEffect, useCallback, useRef } from 'react'
import { useDataProvider } from './context'
import type {
  Workflow,
  Role,
  Task,
  Assignment,
  Project,
  TeamMember,
  AgentMember,
  ProcessRun,
  PendingAction,
  ActivityEntry,
  DataEvent,
} from './types'

interface QueryResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

function useQuery<T>(fetcher: () => Promise<T>, refetchKey?: number): QueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setError(undefined)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey])

  return { data, loading, error }
}

function useQueryWithArg<T>(fetcher: () => Promise<T>, arg: string): QueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setError(undefined)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arg])

  return { data, loading, error }
}

export function useProcesses(refetchKey?: number): QueryResult<Workflow[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getWorkflows(), refetchKey)
}

export function useProcess(id: string): QueryResult<Workflow | undefined> {
  const provider = useDataProvider()
  return useQueryWithArg(() => provider.getWorkflow(id), id)
}

export function useTeam(refetchKey?: number): QueryResult<(TeamMember | AgentMember)[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getTeam(), refetchKey)
}

export function useTeamMember(id: string): QueryResult<(TeamMember | AgentMember) | undefined> {
  const provider = useDataProvider()
  return useQueryWithArg(() => provider.getTeamMember(id), id)
}

export function useRoles(): QueryResult<Role[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getRoles())
}

export function useTasks(): QueryResult<Task[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getTasks())
}

export function useAssignments(): QueryResult<Assignment[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getAssignments())
}

export function useProject(): QueryResult<Project> {
  const provider = useDataProvider()
  return useQuery(() => provider.getProject())
}

export function useProcessRuns(refetchKey?: number): QueryResult<ProcessRun[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getProcessRuns(), refetchKey)
}

export function usePendingActions(refetchKey?: number): QueryResult<PendingAction[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getPendingActions(), refetchKey)
}

export function useActivityFeed(refetchKey?: number): QueryResult<ActivityEntry[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getActivityFeed(), refetchKey)
}

/**
 * Run a process with optional input arguments.
 * Returns { run, running } — call `run(id, args?)` to trigger.
 */
export function useRunProcess(): {
  run: (id: string, args?: Record<string, string>) => Promise<void>
  running: boolean
} {
  const provider = useDataProvider()
  const [running, setRunning] = useState(false)

  const run = useCallback(
    async (id: string, args?: Record<string, string>) => {
      setRunning(true)
      try {
        await provider.runProcess(id, args)
      } finally {
        setRunning(false)
      }
    },
    [provider],
  )

  return { run, running }
}

/**
 * Subscribe to real-time events from the data provider.
 * Returns the list of recent events (newest first) and a refetchKey
 * that increments on each event — pass it to other hooks to trigger re-fetches.
 */
export function useSubscription(maxEvents = 50): {
  events: DataEvent[]
  refetchKey: number
} {
  const provider = useDataProvider()
  const [events, setEvents] = useState<DataEvent[]>([])
  const [refetchKey, setRefetchKey] = useState(0)
  const refetchKeyRef = useRef(0)

  const handleEvent = useCallback(
    (event: DataEvent) => {
      setEvents((prev) => [event, ...prev].slice(0, maxEvents))
      refetchKeyRef.current += 1
      setRefetchKey(refetchKeyRef.current)
    },
    [maxEvents],
  )

  useEffect(() => {
    const unsubscribe = provider.subscribe(handleEvent)
    return unsubscribe
  }, [provider, handleEvent])

  return { events, refetchKey }
}
