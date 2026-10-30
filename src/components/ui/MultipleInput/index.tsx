import { cn } from 'cn';
import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ComponentProps,
  type KeyboardEventHandler,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { InputGroup, InputGroupInput } from '../InputGroup';
import Tag from '../Tag';

type MultipleInputProps<T> = PropsWithChildren<{
  className?: string;
  defaultValue?: T[];
  max?: number;
  value?: T[];
  onValueChange?: (value: T[]) => void;
  renderItem?: (item: T) => ReactNode;
}>;

const MultipleInputContext = createContext<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addValue: (value: any) => void;
  removeValue: (idx: number) => void;
} | null>(null);

const MultipleInput = <T,>({
  defaultValue = [],
  max = Infinity,
  value,
  onValueChange,
  renderItem = String,
  className,
  children,
}: MultipleInputProps<T>) => {
  const [localValue, setLocalValue] = useState(defaultValue);

  const resolvedValue = value ?? localValue;

  const addValue = useCallback(
    (newValue: T) => {
      if (value === undefined) {
        setLocalValue((p) => {
          if (p.length >= max) return p;

          const newVal = [...p, newValue];
          onValueChange?.(newVal);
          return newVal;
        });
      } else {
        if (value.length >= max) return;
        onValueChange?.([...value, newValue]);
      }
    },
    [max, onValueChange, value],
  );

  const removeValue = useCallback(
    (idx: number) => {
      if (value === undefined) {
        setLocalValue((p) => {
          const newValue = [...p];
          newValue.splice(idx, 1);
          onValueChange?.(newValue);
          return newValue;
        });
      } else {
        const newValue = [...value];
        newValue.splice(idx, 1);
        onValueChange?.(newValue);
      }
    },
    [onValueChange, value],
  );

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.isDefaultPrevented()) return;
    if (e.key !== 'Delete') return;

    if (value === undefined) {
      removeValue(localValue.length - 1);
    } else {
      removeValue(value.length - 1);
    }
  };

  return (
    <MultipleInputContext value={{ addValue, removeValue }}>
      <InputGroup
        className={cn('h-auto p-1.5 flex flex-wrap gap-2', className)}
        onKeyDown={handleKeyDown}
      >
        {resolvedValue.map((item, idx) => (
          <Tag key={idx}>
            {renderItem(item)}{' '}
            <button
              type="button"
              className="hover:text-destructive transition-colors"
              onClick={() => removeValue(idx)}
            >
              <X />
            </button>
          </Tag>
        ))}
        {children}
      </InputGroup>
    </MultipleInputContext>
  );
};

const MultipleInputInput = ({
  className,
  ...props
}: ComponentProps<typeof InputGroupInput>) => {
  const ctx = useContext(MultipleInputContext);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    props.onKeyDown?.(e);

    if (e.isDefaultPrevented()) return;
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const value = e.currentTarget.value;

    if (value === '') return;

    ctx?.addValue(value);

    e.currentTarget.value = '';
  };
  return (
    <InputGroupInput
      className={cn(
        'border-none outline-none inline flex-1 w-auto h-auto p-0',
        className,
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export { MultipleInput, MultipleInputInput };
