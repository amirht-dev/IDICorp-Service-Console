import { Button } from '@/components/ui/Button';
import { Field, FieldError } from '@/components/ui/Field';
import { Textarea } from '@/components/ui/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { echoMessageFormInputSchema } from '../../schemas';

const EchoMessageForm = () => {
  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      message: '',
    },
    resolver: zodResolver(echoMessageFormInputSchema),
  });

  const submitHandler = handleSubmit((data) => {
    console.log('🚀 ~ EchoMessageForm ~ data:', data);
    reset();
  });

  const { isSubmitted, isSubmitting, isValid } = formState;

  const isSubmitDisabled = isSubmitting || (isSubmitted && !isValid);

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

      <Button
        type="submit"
        size="xl"
        className="self-start mt-2"
        disabled={isSubmitDisabled}
      >
        <SendIcon />
        Send
      </Button>
    </form>
  );
};

export default EchoMessageForm;
