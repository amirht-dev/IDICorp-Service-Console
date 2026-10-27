import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import SearchInput from '.';

test('should debounce once after delay', async () => {
  const user = userEvent.setup();
  const handleDebounceChange = vi.fn();
  render(<SearchInput onDebounceChange={handleDebounceChange} />);

  const input = screen.getByPlaceholderText(/search/i);

  await user.type(input, 'task title');

  waitFor(() =>
    expect(handleDebounceChange).toHaveBeenCalledExactlyOnceWith('task title'),
  );
});
