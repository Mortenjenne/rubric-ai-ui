import { useQuery } from '@tanstack/react-query'
import { getEvaluation } from '../../shared/api/client'

export function useEvaluation(evaluationId, { enabled } = {}) {
  return useQuery({
    queryKey: ['evaluation', evaluationId],
    queryFn: () => getEvaluation(evaluationId),
    enabled,
    retry: false,
  })
}
