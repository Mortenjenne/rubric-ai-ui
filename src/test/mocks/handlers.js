import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('*/api/evaluations', () => HttpResponse.json({})),
  http.get('*/api/evaluations', () => HttpResponse.json([])),
  http.get('*/api/evaluations/:evaluationId', () => HttpResponse.json({})),
]
