import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/Field';
import { Textarea } from '@/components/ui/Textarea';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrushCleaningIcon, SendIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { streamingFormInputSchema } from '../../schemas';

export const StreamingForm = ({
  onSend,
  disabled = false,
}: {
  onSend?: (message: string) => void;
  disabled?: boolean;
}) => {
  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      message: '',
    },
    disabled,
    resolver: zodResolver(streamingFormInputSchema),
  });

  const {
    isSubmitted,
    isSubmitting,
    isValid,
    disabled: formDisabled,
  } = formState;

  const isDisabled = formDisabled || isSubmitting || (isSubmitted && !isValid);

  const submitHandler = handleSubmit((data) => {
    onSend?.(data.message);
  });

  return (
    <>
      <Card>
        <CardTitle>Send Content</CardTitle>
        <CardContent>
          <form onSubmit={submitHandler}>
            <FieldGroup className="mt-4">
              <Controller
                shouldUnregister
                control={control}
                name="message"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="message-input">Message</FieldLabel>
                    <Textarea
                      id="message-input"
                      placeholder="Enter your message..."
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex items-center gap-2">
              <Button
                size="xl"
                className="mt-4"
                type="submit"
                disabled={isDisabled}
              >
                <SendIcon />
                Send
              </Button>
              <Button
                size="xl"
                className="mt-4"
                variant="outline"
                type="button"
                onClick={() => reset()}
                disabled={isDisabled}
              >
                <BrushCleaningIcon />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DevTool control={control} />
    </>
  );
};
