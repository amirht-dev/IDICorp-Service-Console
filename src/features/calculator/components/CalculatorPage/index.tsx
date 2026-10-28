import ConnectionCard from '@/components/ui/ConnectionCard';
import CalculatorForm from '../CalculatorForm';
import PageHeading from '@/components/shared/PageHeading';

const CalculatorPage = () => {
  return (
    <>
      <div>
        <PageHeading className="mb-6">Calculator</PageHeading>

        <ConnectionCard status="success" url="ws://" />

        <CalculatorForm className="mt-10" />
      </div>
    </>
  );
};

export default CalculatorPage;
