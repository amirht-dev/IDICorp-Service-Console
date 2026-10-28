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
import { StreamingForm } from '../StreamingForm';
import { SquareTextIcon } from 'lucide-react';

const StreamingPage = () => {
  return (
    <div>
      <PageHeading className="mb-6">Streaming</PageHeading>

      <div className="flex flex-col gap-6">
        <StreamingForm />

        <Card>
          <CardTitle>Response</CardTitle>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamingPage;
