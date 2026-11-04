import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { statusTabs, type StatusTabs } from './index.constants';

type StatusFilterTabsProps = {
  disabled?: boolean;
  className?: string;
  value?: StatusTabs;
  onValueChange?: (value: StatusTabs) => void;
};

const StatusFilterTabs = ({
  disabled,
  className,
  value,
  onValueChange,
}: StatusFilterTabsProps) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList aria-disabled={disabled}>
        {Object.values(statusTabs).map((item) => (
          <TabsTrigger value={item.value} key={item.value} disabled={disabled}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default StatusFilterTabs;
