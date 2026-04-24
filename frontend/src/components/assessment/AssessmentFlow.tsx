'use client';
import { useStore } from '@/store/useStore';
import { QUESTIONS } from '@/lib/questions';
import { generateIdeas, saveSession } from '@/lib/api';
import { QuestionCard } from './QuestionCard';
import { StepIndicator } from '@/components/ui/StepIndicator';
import styles from './AssessmentFlow.module.css';
export function AssessmentFlow() {
  const { currentStep, answers, sessionId, nextStep, prevStep, setAnswer, setResult, setLoading, setError, error } = useStore();
  const question = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;
  const handleNext = async () => {
    if (isLastStep) { await handleGenerate(); } else { saveSession(sessionId, answers).catch(()=>{}); nextStep(); }
  };
  const handleGenerate = async () => {
    setLoading(true); setError(null);
    try {
      await saveSession(sessionId, answers);
      const result = await generateIdeas(sessionId, answers);
      setResult(result);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };
  return (
    <div className={styles.wrap}>
      <StepIndicator total={QUESTIONS.length} current={currentStep} />
      {error && <div className={styles.error}>{error}<button className={styles.retryBtn} onClick={handleGenerate}>Try again</button></div>}
      <QuestionCard key={question.id} question={question} answer={answers[question.id as keyof typeof answers]} onAnswer={(val) => setAnswer(question.id as any, val)} onNext={handleNext} onBack={currentStep > 0 ? prevStep : undefined} isLast={isLastStep} />
    </div>
  );
}
