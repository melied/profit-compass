'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { Idea } from '@/types';
import styles from './IdeaCard.module.css';
interface Props { idea: Idea; rank: number; isFavorited: boolean; animationDelay: number; }
const RANK_COLORS = ['#C9A84C','#A8A6A0','#C4915A'];
export function IdeaCard({ idea, rank, isFavorited, animationDelay }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { toggleFavorite, result } = useStore();
  const ideaIndex = result?.ideas.findIndex(i => i.title === idea.title) ?? -1;
  return (
    <div className={`${styles.card} ${expanded?styles.expanded:''}`} style={{ animationDelay: `${animationDelay}ms` }}>
      <div className={styles.header} onClick={() => setExpanded(v=>!v)} role="button" tabIndex={0} onKeyDown={e => e.key==='Enter' && setExpanded(v=>!v)}>
        <div className={styles.rank} style={{ background: RANK_COLORS[rank-1]||'#9A9890' }}>{rank}</div>
        <div className={styles.info}>
          <h3 className={styles.title}>{idea.title}</h3>
          <p className={styles.blurb}>{idea.blurb}</p>
          <div className={styles.chips}>
            <span className={`${styles.chip} ${styles.chipIncome}`}>${idea.incomeMin?.toLocaleString()}–${idea.incomeMax?.toLocaleString()}/{idea.incomeUnit||'mo'}</span>
            <span className={`${styles.chip} ${styles.chipTime}`}>{idea.hoursPerWeek}</span>
            <span className={`${styles.chip} ${styles.chipBudget}`}>{idea.startupCost}</span>
            <span className={`${styles.chip} ${styles.chipCat}`}>{idea.category}</span>
          </div>
          <div className={styles.scoreRow}>
            <span className={styles.scoreLabel}>Feasibility</span>
            <div className={styles.scoreBar}><div className={styles.scoreFill} style={{ width:`${idea.feasibilityScore||70}%` }} /></div>
            <span className={styles.scoreNum}>{idea.feasibilityScore||70}%</span>
          </div>
        </div>
        <span className={styles.toggle}>{expanded?'−':'+'}</span>
      </div>
      {expanded && (
        <div className={styles.body}>
          {[['Revenue Model', idea.revenueModel],['Required Skills', idea.requiredSkills]].map(([label,content]) => (
            <div key={label} className={styles.section}>
              <div className={styles.sectionLabel}>{label}</div>
              <p className={styles.sectionText}>{content}</p>
            </div>
          ))}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>First Steps to Launch</div>
            <ol className={styles.steps}>
              {(idea.firstSteps||[]).map((step,i) => (
                <li key={i} className={styles.step}><span className={styles.stepNum}>{i+1}</span><span>{step}</span></li>
              ))}
            </ol>
          </div>
          {idea.example && <div className={styles.section}><div className={styles.sectionLabel}>Real-World Example</div><div className={styles.exampleBox}>{idea.example}</div></div>}
          {idea.pitfall && <div className={styles.section}><div className={styles.sectionLabel}>Common Pitfall</div><div className={styles.pitfall}>{idea.pitfall}</div></div>}
          <div className={styles.cardActions}>
            <button className={`${styles.favBtn} ${isFavorited?styles.favActive:''}`} onClick={() => ideaIndex>=0 && toggleFavorite(ideaIndex)} type="button">
              {isFavorited?'★ Saved':'☆ Save idea'}
            </button>
            <span className={styles.meta}>First $ in {idea.timeToFirstDollar}</span>
          </div>
        </div>
      )}
    </div>
  );
}
