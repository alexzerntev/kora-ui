import { useState, useEffect } from 'react'
import { useDataProvider } from './context'
import type { Workflow, Role, Task, Assignment, Project, TeamMember, AgentMember } from './types'

interface QueryResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

function useQuery<T>(fetcher: () => Promise<T>): QueryResult<T> {
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
  }, [])

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

export function useProcesses(): QueryResult<Workflow[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getWorkflows())
}

export function useProcess(id: string): QueryResult<Workflow | undefined> {
  const provider = useDataProvider()
  return useQueryWithArg(() => provider.getWorkflow(id), id)
}

export function useTeam(): QueryResult<(TeamMember | AgentMember)[]> {
  const provider = useDataProvider()
  return useQuery(() => provider.getTeam())
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
