import RHFDevTool from '@/components/helpers/RHFDevTool';
import { Button } from '@/components/ui/Button';
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
import { type ComponentProps, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Arrayable } from 'type-fest';
import useUpdateTaskMutation from '../../hooks/useUpdateTaskMutation';
import { updateTaskInputSchema } from '../../schemas';
import type { TaskModel } from '../../types';

type EditTaskDialogProps = {
  task: TaskModel;
  trigger?: Arrayable<ReactElement>;
  onError?: (error: Error) => void;
  onSuccess?: (data: TaskModel) => void;
} & Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>;

const EditTaskDialog = ({
  task,
  trigger,
  open,
  onOpenChange,
  onError,
  onSuccess,
}: EditTaskDialogProps) => {
  const mutation = useUpdateTaskMutation();
  const { control, handleSubmit, reset, setError, formState } = useForm({
    values: {
      title: task.title,
      description: task.description,
      completed: task.completed,
    },
    disabled: mutation.isPending,
    resolver: zodResolver(updateTaskInputSchema),
  });

  const { isSubmitted, isSubmitting, disabled, isValid } = formState;

  const submitHandler = handleSubmit(async (data) => {
    await mutation.mutateAsync(
      { id: task.id, input: data },
      {
        onError(error) {
          if (axios.isAxiosError(error)) {
            if (error.status === 422)
              console.error('validation error', error.response?.data);
            if (error.status === 503)
              setError('root', {
                message: 'something wrong happened. try again later',
              });
          }
          onError?.(error);
        },
        onSuccess(data) {
          reset();
          onSuccess?.(data);
        },
      },
    );
    reset();
  });

  const isDisabled = disabled || mutation.isPending;

  const isSubmitDisabled =
    isDisabled || isSubmitting || (isSubmitted && !isValid);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {Array.isArray(trigger)
          ? trigger.map((t, idx) => <DialogTrigger key={idx} render={t} />)
          : trigger && <DialogTrigger render={trigger} />}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit task details</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <FieldGroup>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="task-title">Title</FieldLabel>
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
                    variant="outline"
                    type="button"
                    onClick={() => reset()}
                    disabled={isDisabled}
                  >
                    Cancel
                  </Button>
                }
              />
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Editing Task' : 'Edit Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <RHFDevTool control={control} />
    </>
  );
};

export default EditTaskDialog;
