'use client';
import type { Question } from '@/types';
import styles from './QuestionCard.module.css';
interface Props { question: Question; answer: string|string[]|undefined; onAnswer: (val: string|string[]) => void; onNext: () => void; onBack?: () => void; isLast: boolean; }
export function QuestionCard({ question, answer, onAnswer, onNext, onBack, isLast }: Props) {
  const isMulti = question.type === 'multi';
  const selectedArr = Array.isArray(answer) ? answer : [];
  const selectedStr = typeof answer === 'string' ? answer : '';
  const hasAnswer = isMulti ? selectedArr.length > 0 : selectedStr !== '';
  function handleOptionClick(label: string) {
    if (isMulti) { const c = [...selectedArr]; const idx = c.indexOf(label); if (idx>-1) c.splice(idx,1); else c.push(label); onAnswer(c); }
    else { onAnswer(label); }
  }
  return (
    <div className={styles.card}>
      {isMulti && <p className={styles.multiHint}>Select all that apply</p>}
      <h2 className={styles.questionText}>{question.text}</h2>
      {question.sub && <p className={styles.questionSub}>{question.sub}</p>}
      <div className={styles.options}>
        {question.options.map(opt => {
          const sel = isMulti ? selectedArr.includes(opt.label) : selectedStr === opt.label;
          return (
            <button key={opt.label} className={`${styles.option} ${sel?styles.selected:''}`} onClick={() => handleOptionClick(opt.label)} type="button">
              <span className={styles.check}>{sel && <span className={styles.checkInner} />}</span>
              <span className={styles.optionContent}>
                <span className={styles.optionLabel}>{opt.label}</span>
                {opt.desc && <span className={styles.optionDesc}>{opt.desc}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.nav}>
        {onBack && <button className={styles.btnOutline} onClick={onBack} type="button">← Back</button>}
        <button className={styles.btnPrimary} onClick={onNext} disabled={!hasAnswer} type="button">
          {isLast ? 'Generate My Ideas →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
