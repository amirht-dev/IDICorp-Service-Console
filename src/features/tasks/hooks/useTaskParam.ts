import { useParams } from 'react-router';

function useTaskParam() {
  const { taskId } = useParams();

  if (!taskId) throw new Error('No taskId');

  return { taskId };
}

export default useTaskParam;
