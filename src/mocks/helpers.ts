import { HttpResponse, type JsonBodyType } from 'msw';

export function mockJsonResponse<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any) => Promise<JsonBodyType>,
>(mockedData: Awaited<ReturnType<NoInfer<T>>>) {
  return HttpResponse.json<Awaited<ReturnType<NoInfer<T>>>>(mockedData);
}
