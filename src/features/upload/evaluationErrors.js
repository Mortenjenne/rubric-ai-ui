const ERROR_COPY = {
  invalid_model_output: {
    message:
      "The evaluation couldn't be completed because the model's response couldn't be trusted. You can try again.",
    retryable: true,
  },
  rate_limited: {
    message: 'The AI provider is rate-limiting requests right now. Try again in a moment.',
    retryable: true,
  },
  upstream_unavailable: {
    message: 'The AI provider is currently unreachable. Try again once it recovers.',
    retryable: true,
  },
  configuration_error: {
    message: "There's a configuration problem with this service. Please report it — retrying won't fix it.",
    retryable: false,
  },
}

const DEFAULT_ERROR_COPY = {
  message: 'Something went wrong while evaluating this submission. You can try again.',
  retryable: true,
}

/** @param {string} code @returns {{ message: string, retryable: boolean }} */
export function getEvaluationErrorCopy(code) {
  return ERROR_COPY[code] ?? DEFAULT_ERROR_COPY
}
