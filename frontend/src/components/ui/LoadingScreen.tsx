'use client';
import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';
const STAGES = ['Analyzing your profile...','Scanning income opportunities...','Ranking by feasibility...','Crafting your personalized roadmap...'];
export function LoadingScreen() {
  const [stage, setStage] = useState(0);
  useEffect(() => { const t = setInterval(() => setStage(s => (s+1)%STAGES.length), 2200); return () => clearInterval(t); }, []);
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <h2 className={styles.title}>Finding your best opportunities</h2>
      <p className={styles.stage} key={stage}>{STAGES[stage]}</p>
      <div className={styles.dots}>{STAGES.map((_,i) => <span key={i} className={`${styles.dot} ${i<=stage?styles.active:''}`} />)}</div>
    </div>
  );
}
