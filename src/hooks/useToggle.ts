import { useCallback, useState } from 'react';

function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((p) => !p);
  }, []);

  return [value, toggle, setValue] as const;
}

export default useToggle;
