/* eslint-disable @typescript-eslint/no-explicit-any */

import { DevTool } from '@hookform/devtools';
import type { DevtoolUIProps } from '@hookform/devtools/dist/devToolUI';
import type { Control, FieldValues } from 'react-hook-form';

/**
 * react hook form dev tool
 */
const RHFDevTool = <T extends FieldValues>(
  props: {
    id?: string | undefined;
    control?: Control<T, any, T> | undefined;
  } & Pick<DevtoolUIProps, 'placement' | 'styles'>,
) => {
  if (import.meta.env.PROD) return;

  return <DevTool {...props} />;
};

export default RHFDevTool;
