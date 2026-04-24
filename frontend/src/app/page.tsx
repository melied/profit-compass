'use client';

import { useStore } from '@/store/useStore';
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow';
import { ResultsView } from '@/components/results/ResultsView';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Brand } from '@/components/ui/Brand';

export default function Home() {
  const { result, isLoading } = useStore();

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '0 1rem 5rem' }}>
      <Brand />
      {isLoading ? (
        <LoadingScreen />
      ) : result ? (
        <ResultsView />
      ) : (
        <AssessmentFlow />
      )}
    </main>
  );
}
