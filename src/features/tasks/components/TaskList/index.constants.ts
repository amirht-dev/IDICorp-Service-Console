import type { ValueOf } from 'type-fest';

export const statusTabs = {
  all: { label: 'All Tasks', value: 'all' },
  active: { label: 'Active', value: 'active' },
  completed: { label: 'Completed', value: 'completed' },
} as const;

export type StatusTabs = ValueOf<typeof statusTabs>['value'];
