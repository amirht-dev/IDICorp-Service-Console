import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ListSortAscendingIcon, ListSortDescendingIcon } from 'lucide-react';
import type { DateSort, SortOrder } from './index.types';

type SortDropdownProps = {
  disabled?: boolean;
  dateSort?: DateSort | null;
  onDateSortChange?: (value: DateSort) => void;
  sortOrder: SortOrder | null;
  onSortOrderChange: (value: SortOrder) => void;
};
function SortDropdown({
  disabled = false,
  dateSort,
  onDateSortChange,
  sortOrder,
  onSortOrderChange,
}: SortDropdownProps) {
  return (
    <DropdownMenu disabled={disabled}>
      <DropdownMenuTrigger render={<Button variant="outline">Sort</Button>} />
      <DropdownMenuContent className="min-w-[160px]" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>By Date</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={dateSort}
            onValueChange={onDateSortChange}
          >
            <DropdownMenuRadioItem value={'created' satisfies DateSort}>
              Date Created
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={'updated' satisfies DateSort}>
              Date Updated
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={sortOrder}
            onValueChange={onSortOrderChange}
            disabled={dateSort === null}
          >
            <DropdownMenuRadioItem value={'asc' satisfies SortOrder}>
              <ListSortAscendingIcon />
              Ascending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={'dec' satisfies SortOrder}>
              <ListSortDescendingIcon />
              Descending
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SortDropdown;
