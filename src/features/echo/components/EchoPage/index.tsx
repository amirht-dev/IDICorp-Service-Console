import PageHeading from '@/components/shared/PageHeading';
import AlertBox from '@/components/ui/AlertBox';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import ConnectionCard from '@/components/ui/ConnectionCard';
import { DEMO_MESSAGES_HISTORY } from '@/data/demo';
import { ReadyState } from '@/hooks/useWebSocket';
import { env } from '@/lib/env';
import useEchoWS from '../../hooks/useEchoWS';
import EchoMessageForm from '../EchoMessageForm';
import EchoMessagesList from '../EchoMessagesList';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const EchoPage = () => {
  useDocumentTitle('Echo');
  const { isReady, readyState, send, error, messagesHistory } = useEchoWS();

  const isDemo =
    readyState !== ReadyState.OPEN && import.meta.env.MODE !== 'test';

  return (
    <div>
      <PageHeading className="mb-6 flex items-center gap-2">
        Echo
        {isReady && <Badge variant="info">Ready</Badge>}
      </PageHeading>

      <div className="flex flex-col gap-10">
        {isDemo && (
          <AlertBox>
            Currently, the{' '}
            <b className="select-all underline">{env.VITE_ECHO_WS_URL}</b>{' '}
            WebSocket service is down due to some issues; therefore, I am using
            demo data to display this page.
          </AlertBox>
        )}

        <ConnectionCard readyState={readyState} url={env.VITE_ECHO_WS_URL} />

        {error && error.type === 'unauthorized' ? (
          <Card className="text-sm bg-error/10 text-error border-error">
            <CardContent>
              Unauthorized. Please try sign out and sign in again
            </CardContent>
          </Card>
        ) : (
          <>
            <EchoMessageForm
              onSend={send}
              disabled={readyState !== ReadyState.OPEN}
              error={
                error?.type !== 'unauthorized' ? error?.message : undefined
              }
            />

            <EchoMessagesList
              messages={isDemo ? DEMO_MESSAGES_HISTORY : messagesHistory}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EchoPage;
