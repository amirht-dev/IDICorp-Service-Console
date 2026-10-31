import RHFDevTool from '@/components/helpers/RHFDevTool';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Arrayable } from 'type-fest';
import useCreateTaskMutation from '../../hooks/useCreateTaskMutation';
import { createTaskInputSchema } from '../../schemas';

type CreateTaskDialogProps = {
  trigger: Arrayable<ReactElement>;
};

const CreateTaskDialog = ({ trigger }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const mutation = useCreateTaskMutation();
  const { control, handleSubmit, reset, formState, setError } = useForm({
    defaultValues: {
      title: '',
      description: '',
      completed: false,
    },
    disabled: mutation.isPending,
    resolver: zodResolver(createTaskInputSchema),
  });

  const { disabled, isSubmitting, isSubmitted, isValid, errors } = formState;

  const submitHandler = handleSubmit(async (data) => {
    await mutation.mutateAsync(data, {
      onError(error) {
        if (axios.isAxiosError(error)) {
          if (error.status === 422)
            console.error('validation error', error.response?.data);
          if (error.status === 503)
            setError('root', {
              message: 'something wrong happened. try again later',
            });
        }
      },
      onSuccess() {
        reset();
        setOpen(false);
      },
    });
  });

  const isDisabled = disabled || mutation.isPending;

  const isSubmitDisabled =
    isDisabled || isSubmitting || (isSubmitted && !isValid);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {Array.isArray(trigger) ? (
          trigger.map((t, idx) => <DialogTrigger render={t} key={idx} />)
        ) : (
          <DialogTrigger render={trigger} />
        )}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new Task</DialogTitle>
            <DialogDescription>
              Add new task to your tasks list
            </DialogDescription>
          </DialogHeader>
          {errors.root && (
            <Card className="border-error bg-error/10 text-error text-sm">
              {errors.root?.message}
            </Card>
          )}
          <form onSubmit={submitHandler}>
            <FieldGroup>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="task-title" required>
                      Title
                    </FieldLabel>
                    <Input
                      id="task-title"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="task-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      className="resize-none min-h-30"
                      id="task-description"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="completed"
                render={({ field, fieldState }) => {
                  const { value, onChange, ...restField } = field;
                  return (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id="task-completed"
                        aria-invalid={fieldState.invalid}
                        {...restField}
                        checked={value}
                        onCheckedChange={(checked) => onChange(checked)}
                      />
                      <FieldLabel htmlFor="task-completed">
                        Completed
                      </FieldLabel>

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose
                render={
                  <Button
                    disabled={isDisabled}
                    variant="outline"
                    type="button"
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                }
              />
              <Button type="submit" disabled={isSubmitDisabled}>
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <RHFDevTool control={control} />
    </>
  );
};

export default CreateTaskDialog;
