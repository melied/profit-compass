'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { QUESTIONS } from '@/lib/questions';
import { generateIdeas } from '@/lib/api';
import QuestionCard from '@/components/QuestionCard';
import LoadingScreen from '@/components/LoadingScreen';
import IdeaCard from '@/components/IdeaCard';
import ProgressBar from '@/components/ProgressBar';
import FavoritesPanel from '@/components/FavoritesPanel';
import { exportToPdf } from '@/lib/exportPdf';

export default function Home() {
  const {
    screen,
    currentQuestion,
    answers,
    sessionId,
    summary,
    ideas,
    favorites,
    setScreen,
    setResults,
    setLoadingMessage,
    reset,
  } = useAppStore();

  // Auto-generate when all questions answered
  useEffect(() => {
    if (currentQuestion === QUESTIONS.length && screen === 'assessment') {
      handleGenerate();
    }
  }, [currentQuestion]);

  async function handleGenerate() {
    setScreen('loading');
    try {
      const result = await generateIdeas(answers, sessionId || undefined);
      setResults(result.sessionId, result.summary, result.ideas);
    } catch (err: any) {
      setScreen('assessment');
      alert(err.message || 'Failed to generate ideas. Please try again.');
    }
  }

  async function handleExport() {
    await exportToPdf(ideas, summary, answers);
  }

  const tags = [
    answers.time,
    answers.budget,
    answers.goal,
  ].filter(Boolean) as string[];

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <a className="brand-logo" href="/">
            <span className="brand-diamond" />
            <span className="brand-name">Profit Compass</span>
          </a>
          {screen === 'results' && (
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={reset}>
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* Assessment */}
        {screen === 'assessment' && currentQuestion < QUESTIONS.length && (
          <>
            {currentQuestion === 0 && (
              <div className="hero">
                <p className="hero-eyebrow">Online Income Discovery Tool</p>
                <h1 className="hero-title">Find Your Perfect Online Income Path</h1>
                <p className="hero-sub">
                  Answer 7 quick questions about your skills, time, and goals.
                  Get 6 personalized, ranked income ideas — specific enough to start today.
                </p>
              </div>
            )}
            <ProgressBar current={currentQuestion} total={QUESTIONS.length} />
            <QuestionCard
              question={QUESTIONS[currentQuestion]}
              questionIndex={currentQuestion}
            />
          </>
        )}

        {/* Loading */}
        {screen === 'loading' && <LoadingScreen />}

        {/* Results */}
        {screen === 'results' && ideas.length > 0 && (
          <>
            <div className="results-header">
              <h2 className="results-title">Your Personalized Profit Ideas</h2>
              <p className="results-summary">{summary}</p>
              {tags.length > 0 && (
                <div className="results-tags">
                  {tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>

            <div className="results-actions">
              <button className="btn btn-gold" onClick={handleExport}>
                ⬇ Download PDF
              </button>
              <button className="btn btn-outline" onClick={reset}>
                ↺ Start Over
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  reset();
                  setTimeout(() => setScreen('assessment'), 50);
                }}
              >
                ⚙ Adjust My Answers
              </button>
            </div>

            <FavoritesPanel />

            {ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} index={i} />
            ))}

            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: '2rem' }}>
              Income estimates are realistic projections based on market research, not guarantees.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
