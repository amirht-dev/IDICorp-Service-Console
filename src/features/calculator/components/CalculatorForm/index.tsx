import { Button } from '@/components/ui/Button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/Field';
import {
  MultipleInput,
  MultipleInputInput,
} from '@/components/ui/MultipleInput';
import { Spinner } from '@/components/ui/Spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import {
  BrushCleaningIcon,
  Calculator,
  DivideIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import { type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  calculatorFormInputSchema,
  type CalculatorInput,
  type CalculatorOperator,
} from '../../schemas';

const operators = {
  add: {
    value: 'add',
    label: 'Add',
    icon: <PlusIcon />,
  },
  subtract: {
    value: 'subtract',
    label: 'Subtract',
    icon: <MinusIcon />,
  },
  multiply: {
    value: 'multiply',
    label: 'Multiply',
    icon: <XIcon />,
  },
  divide: {
    value: 'divide',
    label: 'Divide',
    icon: <DivideIcon />,
  },
} satisfies Record<
  CalculatorOperator,
  { value: string; label: string; icon: ReactElement }
>;

type CalculatorFormProps = {
  className?: string;
  disabled?: boolean;
  result?: number | null;
  onCalculate?: (data: CalculatorInput) => void;
  onClear?: () => void;
};

const CalculatorForm = ({
  disabled = false,
  onCalculate,
  result = null,
  onClear,
  className,
}: CalculatorFormProps) => {
  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      operation: 'add',
      numbers: [],
    },
    disabled,
    resolver: zodResolver(calculatorFormInputSchema),
  });

  const {
    isSubmitting,
    isSubmitted,
    isValid,
    disabled: formDisabled,
  } = formState;

  const submitHandler = handleSubmit((data) => {
    onCalculate?.(data);
  });

  const isSubmitDisabled =
    formDisabled || isSubmitting || (isSubmitted && !isValid);

  return (
    <>
      <form
        className={cn(
          'flex flex-col 2xl:flex-row 2xl:items-center gap-8',
          className,
        )}
        onSubmit={submitHandler}
      >
        <FieldGroup className="flex-1">
          <Controller
            control={control}
            name="operation"
            render={({ field, fieldState }) => {
              const { value, onChange, ref, disabled } = field;
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel id="operator-label" required>
                    Operation
                  </FieldLabel>
                  <ToggleGroup
                    aria-labelledby="operator-label"
                    multiple={false}
                    value={[value]}
                    onValueChange={(value) => onChange(value[0])}
                    ref={ref}
                    disabled={disabled}
                  >
                    {Object.values(operators).map((operator) => (
                      <ToggleGroupItem
                        key={operator.value}
                        value={operator.value}
                        variant="outline"
                      >
                        {operator.icon}
                        {operator.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              );
            }}
          />

          <Controller
            control={control}
            name="numbers"
            render={({ field, fieldState }) => {
              const { value, onChange, ...restField } = field;
              return (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="numbers-field" required>
                    Numbers
                  </FieldLabel>
                  <MultipleInput
                    max={100}
                    className="sm:max-w-md"
                    value={value}
                    onValueChange={(value) => onChange(value.map(Number))}
                  >
                    <MultipleInputInput
                      {...restField}
                      aria-invalid={!!fieldState.error}
                      id="numbers-field"
                      inputMode="numeric"
                      autoComplete="off"
                      onBeforeInput={(e) => {
                        if (!/\d/i.test(e.data)) e.preventDefault();
                      }}
                    />
                  </MultipleInput>
                  {fieldState.error ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : (
                    <FieldDescription>
                      to add multiple numbers, type number and press enter
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <div className="flex max-md:flex-col shrink-0 self-center gap-2">
          <Button size="xl" type="submit" disabled={isSubmitDisabled}>
            {isSubmitting ? <Spinner /> : <Calculator />}
            Calculate
          </Button>
          <Button
            size="xl"
            type="button"
            variant="outline"
            disabled={isSubmitDisabled}
            onClick={() => {
              reset();
              onClear?.();
            }}
          >
            <BrushCleaningIcon />
            Clear
          </Button>
        </div>

        <div className="flex-1 bg-secondary flex items-center justify-center min-h-40 rounded-lg">
          {result == null ? (
            <span>no calculation yet</span>
          ) : (
            <span>
              calculation result: <span className="font-bold">{result}</span>
            </span>
          )}
        </div>
      </form>

      <DevTool control={control} />
    </>
  );
};

export default CalculatorForm;
