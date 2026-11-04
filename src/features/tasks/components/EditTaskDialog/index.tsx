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
import { handleApiError } from '@/lib/errors';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const { isSubmitted, isSubmitting, disabled, isValid, errors } = formState;

  const submitHandler = handleSubmit(async (data) => {
    mutation.mutate(
      { id: task.id, input: data },
      {
        onError(error) {
          const err = handleApiError(error);

          let message: string;

          if (err.type === 'network') {
            message = 'Unable to connect to server. Please try again.';
          } else if (err.type === 'timeout') {
            message =
              'Server did not respond within allotted time. Please try again.';
          } else if (err.type === 'cancelled') {
            message = 'Editing task was cancelled. please try again';
          } else if (err.type === 'http') {
            if (err.status === 422)
              message =
                'Server validation error. See console for more details.';
            else if (err.status >= 500)
              message =
                'Failed to edit task. Server is unavailable right now. Please try again later.';
            else message = 'Failed to edit task.';
          } else message = 'Unknown error occurred when editing task.';

          setError('root', { message });
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
                    <FieldLabel required htmlFor="task-title">
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
