import { useEventListener } from 'usehooks-ts';

function useKeyboardShortcut(
  options: {
    key: string;
    alt?: boolean;
    ctrl?: boolean;
  },
  cb: (ev: KeyboardEvent) => void,
) {
  useEventListener('keydown', (e) => {
    const { key, altKey, ctrlKey } = e;

    if (options.alt && !altKey) return;
    if (options.ctrl && !ctrlKey) return;
    if (options.key.toLowerCase() !== key.toLowerCase()) return;

    e.preventDefault();
    cb(e);
  });
}

export default useKeyboardShortcut;
