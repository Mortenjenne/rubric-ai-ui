import { strings } from '../../shared/i18n/strings'

const ERROR_COPY = {
  invalid_model_output: {
    message: strings.errors.invalidModelOutput,
    retryable: true,
  },
  rate_limited: {
    message: strings.errors.rateLimited,
    retryable: true,
  },
  upstream_unavailable: {
    message: strings.errors.upstreamUnavailable,
    retryable: true,
  },
  configuration_error: {
    message: strings.errors.configurationError,
    retryable: false,
  },
}

const DEFAULT_ERROR_COPY = {
  message: strings.errors.generic,
  retryable: true,
}

/** @param {string} code @returns {{ message: string, retryable: boolean }} */
export function getEvaluationErrorCopy(code) {
  return ERROR_COPY[code] ?? DEFAULT_ERROR_COPY
}
