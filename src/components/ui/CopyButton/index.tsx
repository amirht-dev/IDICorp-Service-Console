import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import type { Merge } from 'type-fest';
import { useCopyToClipboard } from 'usehooks-ts';
import { Button } from '../Button';

type CopyButtonProps = Merge<
  ComponentProps<typeof Button>,
  {
    content?: string;
  }
>;

const CopyButton = ({ content, ...props }: CopyButtonProps) => {
  const [, copy] = useCopyToClipboard();
  const [clicked, setClicked] = useState(false);

  const handleCopy = async () => {
    if (!content) return;

    setClicked(true);
    await copy(content);
    setTimeout(() => setClicked(false), 1000);
  };
  return (
    <Button variant="ghost" {...props} onClick={handleCopy} size="icon">
      {clicked ? <CheckIcon className="text-success" /> : <CopyIcon />}
    </Button>
  );
};

export default CopyButton;
