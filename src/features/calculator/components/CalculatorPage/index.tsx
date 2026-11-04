import PageHeading from '@/components/shared/PageHeading';
import { Badge } from '@/components/ui/Badge';
import ConnectionCard from '@/components/ui/ConnectionCard';
import {
  DetailCard,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { ReadyState } from '@/hooks/useWebSocket';
import { env } from '@/lib/env';
import { TriangleAlertIcon } from 'lucide-react';
import useCalculateWS from '../../hooks/useCalculateWS';
import CalculatorForm from '../CalculatorForm';

const CalculatorPage = () => {
  useDocumentTitle('Calculator');
  const { result, error, readyState, calculate, isReady, clear } =
    useCalculateWS();

  return (
    <>
      <div>
        <PageHeading className="mb-6 flex items-center gap-2">
          Calculator
          {isReady && <Badge variant="info">Ready</Badge>}
        </PageHeading>

        <ConnectionCard
          readyState={readyState}
          url={env.VITE_CALCULATOR_WS_URL}
        />

        {error ? (
          <DetailCard
            variant="error"
            className="border border-dashed border-destructive rounded-lg mt-4"
          >
            <DetailCardHeader>
              <DetailCardMedia variant="icon">
                <TriangleAlertIcon />
              </DetailCardMedia>
              <DetailCardTitle>Failed</DetailCardTitle>
              <DetailCardDescription>{error}</DetailCardDescription>
            </DetailCardHeader>
          </DetailCard>
        ) : (
          <CalculatorForm
            onCalculate={calculate}
            disabled={readyState !== ReadyState.OPEN}
            result={result}
            onClear={clear}
            className="mt-10"
          />
        )}
      </div>
    </>
  );
};

export default CalculatorPage;
