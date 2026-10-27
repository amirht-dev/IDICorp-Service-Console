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
import { DevTool } from '@hookform/devtools';
import { type ComponentProps, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Arrayable } from 'type-fest';

type EditTaskDialogProps = {
  trigger?: Arrayable<ReactElement>;
  // taskId: string
} & Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>;

const EditTaskDialog = ({
  trigger,
  open,
  onOpenChange,
}: EditTaskDialogProps) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      completed: false,
    },
  });
  const submitHandler = handleSubmit((data) => {
    console.log('🚀 ~ EditTaskDialog ~ data:', data);
    reset();
  });

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
                  >
                    Cancel
                  </Button>
                }
              />
              <Button type="submit">Edit Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <DevTool control={control} />
    </>
  );
};

export default EditTaskDialog;
