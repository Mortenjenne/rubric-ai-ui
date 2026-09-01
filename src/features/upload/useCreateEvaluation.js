import { useMutation } from '@tanstack/react-query'
import { createEvaluation } from '../../shared/api/client'

export function useCreateEvaluation() {
  return useMutation({
    mutationFn: createEvaluation,
  })
}
