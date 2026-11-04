import PageHeading from '@/components/shared/PageHeading';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import CopyButton from '@/components/ui/CopyButton';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { Spinner } from '@/components/ui/Spinner';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { SquareTextIcon, TriangleAlertIcon } from 'lucide-react';
import { useRef } from 'react';
import useStreamingText from '../../hooks/useStreamText';
import { StreamingForm } from '../StreamingForm';

const StreamingPage = () => {
  useDocumentTitle('Streaming');
  const responseRef = useRef<HTMLDivElement>(null);

  const { responseMessage, error, loading, progress, startStream } =
    useStreamingText({
      onStream: () => {
        responseRef.current?.scrollTo({
          top: responseRef.current.scrollHeight,
        });
      },
    });

  return (
    <div>
      <PageHeading className="mb-6">Streaming</PageHeading>

      <div className="flex flex-col gap-6">
        <StreamingForm onSend={startStream} disabled={loading} />

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>
              <span className="flex items-center gap-2">
                Response
                {loading && (
                  <Spinner role="presentation" aria-label="loading" />
                )}
              </span>
            </CardTitle>

            {responseMessage && (
              <CopyButton content={responseMessage} disabled={loading} />
            )}
          </div>

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
                <pre
                  role="log"
                  className="bg-secondary text-secondary-foreground p-3 rounded-md min-h-full text-wrap"
                >
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
