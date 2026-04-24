import styles from './Brand.module.css';
export function Brand() {
  return (
    <header className={styles.header}>
      <div className={styles.mark}>
        <span className={styles.diamond} />
        <span className={styles.wordmark}>Profit Compass</span>
        <span className={styles.diamond} />
      </div>
      <h1 className={styles.headline}>Find Your Online Income Path</h1>
      <p className={styles.sub}>Answer 7 quick questions. Get personalized, actionable profit ideas — ranked by feasibility.</p>
    </header>
  );
}
