import { Button } from '@/components/ui/Button';
import { Field, FieldError } from '@/components/ui/Field';
import { Textarea } from '@/components/ui/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrushCleaningIcon, SendIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  echoMessageFormInputSchema,
  type EchoMessageInput,
} from '../../schemas';

type EchoMessageFormProps = {
  disabled?: boolean;
  onSend?: (data: EchoMessageInput) => void;
};

const EchoMessageForm = ({ disabled, onSend }: EchoMessageFormProps) => {
  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      message: '',
    },
    disabled,
    resolver: zodResolver(echoMessageFormInputSchema),
  });

  const submitHandler = handleSubmit((data) => {
    onSend?.(data);
    reset();
  });

  const {
    isSubmitted,
    isSubmitting,
    isValid,
    disabled: formDisabled,
  } = formState;

  const isSubmitDisabled =
    formDisabled || isSubmitting || (isSubmitted && !isValid);

  return (
    <form onSubmit={submitHandler}>
      <Controller
        control={control}
        name="message"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea
              placeholder="Type your message..."
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      <div className="flex items-center gap-2 mt-2">
        <Button type="submit" size="xl" disabled={isSubmitDisabled}>
          <SendIcon />
          Send
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xl"
          disabled={isSubmitDisabled}
          onClick={() => reset()}
        >
          <BrushCleaningIcon />
          Clear
        </Button>
      </div>
    </form>
  );
};

export default EchoMessageForm;
