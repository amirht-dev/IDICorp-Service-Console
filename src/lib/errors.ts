import axios from 'axios';
import type { IntRange } from 'type-fest';
import { z } from 'zod/v4';

export const serverValidationErrorSchema = z.array(
  z.object({
    loc: z.array(z.string()),
    msg: z.string(),
    type: z.string(),
    input: z.unknown(),
    ctx: z.unknown(),
  }),
);

export const serverApiErrorResponseSchema = z.union([
  z.object({
    status: z.custom<Exclude<IntRange<400, 500>, 422>>(
      (status) => typeof status === 'number' && status >= 400 && status !== 422,
    ),
    error: z.object({
      detail: z.string(),
    }),
  }),
  z.object({
    status: z.literal(422),
    error: z.object({
      detail: serverValidationErrorSchema,
    }),
  }),
]);

type ApiError =
  | {
      type: 'timeout' | 'network' | 'cancelled';
      message: string;
    }
  | {
      type: 'http';
      message: string;
      status: number;
      serverMessage: string | null;
    }
  | {
      type: 'unknown';
      message: string;
      reason: string;
    };

export function handleApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      type: 'unknown',
      message: 'An unexpected error occurred.',
      reason: error instanceof Error ? error.message : '',
    };
  }

  if (axios.isCancel(error)) {
    return {
      type: 'cancelled',
      message: 'Request was cancelled.',
    };
  }

  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
    return {
      type: 'timeout',
      message: 'Request timed out.',
    };
  }

  if (error.response) {
    const { data } = serverApiErrorResponseSchema.safeParse({
      status: error.response.status,
      error: error?.response?.data,
    });
    const serverMessage = data
      ? data.status === 422
        ? data.error.detail.map((er) => er.msg).join(' \n')
        : data.error.detail
      : null;
    return {
      type: 'http',
      status: error.response.status,
      message: error.message,
      serverMessage,
    };
  }

  if (error.code === 'ERR_NETWORK') {
    return {
      type: 'network',
      message: 'Network error occurred.',
    };
  }

  return {
    type: 'unknown',
    message: error.message,
    reason: '',
  };
}
