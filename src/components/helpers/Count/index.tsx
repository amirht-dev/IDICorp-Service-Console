import type { ReactNode } from 'react';

function Count({
  count,
  render,
}: {
  count: number;
  render: (idx: number) => ReactNode;
}) {
  return Array.from({ length: count }, (_, idx) => render(idx));
}

export default Count;
