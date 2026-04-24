'use client';

import { useStore } from '@/store/useStore';
import type { Idea } from '@/types';
import styles from './FavoritesPanel.module.css';

interface Props {
  ideas: Idea[];
  indices: number[];
}

export function FavoritesPanel({ ideas, indices }: Props) {
  const { toggleFavorite } = useStore();

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>
        <span className={styles.star}>★</span>
        Saved Ideas ({ideas.length})
      </h3>
      <div className={styles.list}>
        {ideas.map((idea, i) => (
          <div key={idea.title} className={styles.item}>
            <span className={styles.itemTitle}>{idea.title}</span>
            <span className={styles.itemIncome}>
              ${idea.incomeMin?.toLocaleString()}–${idea.incomeMax?.toLocaleString()}/mo
            </span>
            <button
              className={styles.removeBtn}
              onClick={() => toggleFavorite(indices[i])}
              aria-label={`Remove ${idea.title} from saved`}
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
