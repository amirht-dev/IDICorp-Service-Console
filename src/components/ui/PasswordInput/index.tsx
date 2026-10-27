import useToggle from '@/hooks/useToggle';
import { EyeClosedIcon, EyeIcon, LockIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { Merge } from 'type-fest';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../InputGroup';

type PasswordInputProps = Merge<
  ComponentProps<typeof InputGroupInput>,
  { showInlineStartIcon?: boolean }
>;

const PasswordInput = ({
  showInlineStartIcon = true,
  className,
  ...props
}: PasswordInputProps) => {
  const [visible, toggleVisible] = useToggle(false);

  return (
    <InputGroup className={className}>
      <InputGroupInput
        type={visible ? 'text' : 'password'}
        placeholder="Enter your password"
        {...props}
      />
      {showInlineStartIcon && (
        <InputGroupAddon align="inline-start">
          <LockIcon />
        </InputGroupAddon>
      )}
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          className="rounded-full"
          onClick={toggleVisible}
          role="button switch"
          aria-label={visible ? 'hide password' : 'show password'}
        >
          {visible ? <EyeClosedIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default PasswordInput;
