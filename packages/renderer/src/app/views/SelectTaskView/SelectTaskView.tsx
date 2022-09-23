import LoadingText from '@/app/ui/LoadingText';
import { FC, Suspense } from 'react';
import SelectTaskContents from './SelectTaskContents';

const SelectTaskView: FC = () => {
  return (
    <Suspense fallback={<LoadingText />}>
      <SelectTaskContents />
    </Suspense>
  );
};

export default SelectTaskView;
