import PageHeading from '@/components/shared/PageHeading';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { UnauthenticatedError } from '@/lib/exceptions';
import { SquareTextIcon, TriangleAlertIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { textStreaming } from '../../services/streaming.service';
import { StreamingForm } from '../StreamingForm';

const StreamingPage = () => {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  const { updateAuth } = useAuth();

  const handleStreamMessage = async (message: string) => {
    setResponseMessage('');
    setError(null);
    setMessage(message);

    try {
      setLoading(true);

      await textStreaming(message, (chunk) => {
        setResponseMessage((prev) => (prev ? prev.concat(chunk) : chunk));
        responseRef.current?.scrollTo({
          top: responseRef.current.scrollHeight,
        });
      });
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        updateAuth({ status: 'unauthenticated' });
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'something wrong happened when streaming message',
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = responseMessage
    ? responseMessage.length / message.length
    : 0;

  return (
    <div>
      <PageHeading className="mb-6">Streaming</PageHeading>

      <div className="flex flex-col gap-6">
        <StreamingForm onSend={handleStreamMessage} disabled={loading} />

        <Card>
          <CardTitle>
            <span className="flex items-center gap-2">
              Response
              {loading && <Spinner />}
            </span>
          </CardTitle>
          <CardContent>
            {error ? (
              <DetailCard
                variant="error"
                className="border border-dashed rounded-lg"
              >
                <DetailCardHeader>
                  <DetailCardMedia variant="icon">
                    <TriangleAlertIcon />
                  </DetailCardMedia>
                  <DetailCardTitle>Failed to stream response</DetailCardTitle>
                  <DetailCardDescription>{error}</DetailCardDescription>
                </DetailCardHeader>
              </DetailCard>
            ) : responseMessage == null ? (
              <DetailCard>
                <DetailCardHeader>
                  <DetailCardMedia variant="icon">
                    <SquareTextIcon />
                  </DetailCardMedia>
                  <DetailCardTitle>No Response Yet</DetailCardTitle>
                  <DetailCardDescription>
                    Send content to see streamed response here
                  </DetailCardDescription>
                </DetailCardHeader>
                <DetailCardContent></DetailCardContent>
              </DetailCard>
            ) : (
              <div className="h-40 overflow-auto relative" ref={responseRef}>
                <div
                  className="bg-success h-0.5 sticky top-0"
                  style={{ width: `${progress * 100}%` }}
                />
                <pre className="bg-secondary text-secondary-foreground p-3 rounded-md min-h-full text-wrap">
                  {responseMessage}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamingPage;
