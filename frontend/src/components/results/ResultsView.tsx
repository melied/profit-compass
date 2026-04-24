'use client';
import { useStore } from '@/store/useStore';
import { exportToPDF } from '@/lib/exportPDF';
import { IdeaCard } from './IdeaCard';
import { FavoritesPanel } from './FavoritesPanel';
import styles from './ResultsView.module.css';
export function ResultsView() {
  const { result, answers, favorites, reset } = useStore();
  if (!result) return null;
  const favIdeas = result.ideas.filter((_,i) => favorites.includes(i));
  const profileTags = [answers.time, answers.budget, answers.goal].filter(Boolean) as string[];
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Personalized Profit Ideas</h2>
        <p className={styles.summary}>{result.summary}</p>
        <div className={styles.tags}>{profileTags.map(t => <span key={t} className={styles.tag}>{t}</span>)}</div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnGold} onClick={() => exportToPDF(result, answers).catch(console.error)}>⬇ Download PDF</button>
        <button className={styles.btnOutline} onClick={reset}>↺ Start Over</button>
      </div>
      {favIdeas.length > 0 && <FavoritesPanel ideas={favIdeas} indices={favorites} />}
      <div className={styles.ideas}>
        {result.ideas.map((idea,i) => <IdeaCard key={idea.title} idea={idea} rank={i+1} isFavorited={favorites.includes(i)} animationDelay={i*70} />)}
      </div>
      <p className={styles.disclaimer}>Income estimates are realistic projections based on market data — not guarantees. Results depend on consistent effort, niche choice, and execution quality.</p>
    </div>
  );
}
