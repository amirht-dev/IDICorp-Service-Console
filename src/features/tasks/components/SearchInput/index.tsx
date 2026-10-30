import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/InputGroup';
import { Kbd } from '@/components/ui/Kbd';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import { SearchIcon } from 'lucide-react';
import { useCallback, useRef, useState, type ComponentProps } from 'react';
import type { Merge } from 'type-fest';
import { useDebounceCallback } from 'usehooks-ts';

type SearchInputProps = Merge<
  ComponentProps<typeof InputGroupInput>,
  {
    onDebounceChange?: (value: string) => void;
  }
>;

const SearchInput = ({
  onDebounceChange,
  className,
  ...props
}: SearchInputProps) => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const callback = useCallback(
    (value: string) => {
      onDebounceChange?.(value);
    },
    [onDebounceChange],
  );

  const debounce = useDebounceCallback(callback, 500);

  useKeyboardShortcut({ key: 'k', ctrl: true }, () => {
    ref.current?.focus();
  });

  return (
    <InputGroup className={className}>
      <InputGroupInput
        ref={ref}
        aria-label="search tasks"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
          debounce(value);
        }}
        {...props}
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;
