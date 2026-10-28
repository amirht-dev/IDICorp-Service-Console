import PageHeading from '@/components/shared/PageHeading';
import ConnectionCard from '@/components/ui/ConnectionCard';
import { useState } from 'react';
import EchoMessageForm from '../EchoMessageForm';
import EchoMessagesList from '../EchoMessagesList';

const EchoPage = () => {
  const [messages, setMessages] = useState([
    { sender: true, content: 'test user' },
    { sender: false, content: 'test bot' },
  ]);

  return (
    <div>
      <PageHeading className="mb-6">Echo</PageHeading>

      <div className="flex flex-col gap-10">
        <ConnectionCard status="success" url="ws://" />

        <EchoMessageForm />

        <EchoMessagesList messages={messages} />
      </div>
    </div>
  );
};

export default EchoPage;
