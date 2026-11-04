import { vi } from 'vitest';
export * from 'react-router';

const useNavigate = () => vi.fn();
const useParams = vi.fn(() => ({}));

export { useNavigate, useParams };
