import PageHeading from '@/components/shared/PageHeading';
import AlertBox from '@/components/ui/AlertBox';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import ConnectionCard from '@/components/ui/ConnectionCard';
import { DEMO_MESSAGES_HISTORY } from '@/data/demo';
import { env } from '@/lib/env';
import { ReadyState } from 'react-use-websocket';
import useEchoWS from '../../hooks/useEchoWS';
import EchoMessageForm from '../EchoMessageForm';
import EchoMessagesList from '../EchoMessagesList';

const EchoPage = () => {
  const { isReady, readyState, send, error } = useEchoWS();

  return (
    <div>
      <PageHeading className="mb-6 flex items-center gap-2">
        Echo
        {isReady && <Badge variant="info">Ready</Badge>}
      </PageHeading>

      <div className="flex flex-col gap-10">
        <AlertBox>
          Currently, the{' '}
          <b className="select-all underline">{env.VITE_ECHO_WS_URL}</b>{' '}
          WebSocket service is down due to some issues; therefore, I am using
          demo data to display this page.
        </AlertBox>

        <ConnectionCard readyState={readyState} url={env.VITE_ECHO_WS_URL} />

        <EchoMessageForm
          onSend={send}
          disabled={readyState !== ReadyState.OPEN}
        />

        {error && (
          <Card className="text-sm bg-error/10 text-error border-error">
            <CardContent>{error}</CardContent>
          </Card>
        )}

        <EchoMessagesList messages={DEMO_MESSAGES_HISTORY} />
      </div>
    </div>
  );
};

export default EchoPage;
