import styles from './StepIndicator.module.css';
interface Props { total: number; current: number; }
export function StepIndicator({ total, current }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`${styles.dot} ${i < current ? styles.done : ''} ${i === current ? styles.active : ''}`} />
        ))}
      </div>
      <p className={styles.label}>Question {current + 1} of {total}</p>
    </div>
  );
}
