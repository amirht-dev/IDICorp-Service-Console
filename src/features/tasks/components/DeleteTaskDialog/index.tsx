import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Trash2Icon } from 'lucide-react';
import type { ComponentProps, ReactElement } from 'react';
import type { Arrayable } from 'type-fest';

type DeleteTaskDialogProps = {
  // taskId: string
  trigger?: Arrayable<ReactElement>;
} & Pick<ComponentProps<typeof AlertDialog>, 'open' | 'onOpenChange'>;

const DeleteTaskDialog = ({
  trigger,
  open,
  onOpenChange,
}: DeleteTaskDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {Array.isArray(trigger)
        ? trigger.map((t, idx) => <AlertDialogTrigger key={idx} render={t} />)
        : trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this task. are you sure you want to
            delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            Delete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskDialog;
