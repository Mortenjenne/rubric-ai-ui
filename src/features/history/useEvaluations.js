import { useQuery } from '@tanstack/react-query'
import { listEvaluations } from '../../shared/api/client'

export function useEvaluations() {
  return useQuery({
    queryKey: ['evaluations'],
    queryFn: listEvaluations,
    retry: false,
  })
}
