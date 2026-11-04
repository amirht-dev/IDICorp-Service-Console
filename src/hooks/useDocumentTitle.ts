import { useDocumentTitle as originalUseDocumentTitle } from 'usehooks-ts';

function useDocumentTitle(
  title: string,
  prefix: boolean | string | string[] = true,
) {
  const prefixes = Array.isArray(prefix)
    ? prefix
    : typeof prefix === 'string'
      ? [prefix]
      : prefix
        ? ['IDICorp']
        : [];
  const titleSegments = [...prefixes];
  if (title) titleSegments.push(title);

  return originalUseDocumentTitle(titleSegments.join(' | '));
}

export default useDocumentTitle;
