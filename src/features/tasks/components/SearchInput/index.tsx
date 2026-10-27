import { SearchIcon } from 'lucide-react';
import { useCallback, useState, type ComponentProps } from 'react';
import type { Merge } from 'type-fest';
import { useDebounceCallback } from 'usehooks-ts';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../../../components/ui/InputGroup';

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

  const callback = useCallback(
    (value: string) => {
      onDebounceChange?.(value);
    },
    [onDebounceChange],
  );

  const debounce = useDebounceCallback(callback, 500);

  return (
    <InputGroup className={className}>
      <InputGroupInput
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
    </InputGroup>
  );
};

export default SearchInput;
