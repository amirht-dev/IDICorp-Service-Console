import { Button } from '@/components/ui/Button';
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
import { useState, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Arrayable } from 'type-fest';

type CreateTaskDialogProps = {
  trigger: Arrayable<ReactElement>;
};

const CreateTaskDialog = ({ trigger }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const submitHandler = handleSubmit((data) => {
    console.log('🚀 ~ CreateTaskDialog ~ data:', data);
    reset();
    setOpen(false);
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {Array.isArray(trigger)
          ? trigger.map((t, idx) => <DialogTrigger render={t} key={idx} />)
          : trigger}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new Task</DialogTitle>
            <DialogDescription>
              Add new task to your tasks list
            </DialogDescription>
          </DialogHeader>
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
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <DevTool control={control} />
    </>
  );
};

export default CreateTaskDialog;
