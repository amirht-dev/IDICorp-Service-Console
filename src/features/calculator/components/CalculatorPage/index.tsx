import ConnectionCard from '@/components/ui/ConnectionCard';
import CalculatorForm from '../CalculatorForm';

const CalculatorPage = () => {
  return (
    <>
      <div>
        <h4 className="text-2xl lg:text-3xl font-semibold mb-6">Calculator</h4>

        <ConnectionCard status="success" url="ws://" />

        <CalculatorForm className="mt-10" />
      </div>
    </>
  );
};

export default CalculatorPage;
