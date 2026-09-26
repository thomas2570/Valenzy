import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const C = {
  indigo: '#6366f1', indigoDark: '#4f46e5', indigoLight: '#e0e7ff',
  green: '#10b981', greenLight: '#d1fae5',
  text: '#111827', sub: '#6b7280', border: '#e5e7eb', white: '#ffffff',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

export default function LeaderboardPage() {
  const [view, setView] = useState('all_time'); // 'weekly' or 'all_time'
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q = query(
      collection(db, 'users'),
      orderBy('total_score', 'desc'),
      limit(50)
    );
      
    if (view === 'weekly') {
      // Placeholder for weekly filter logic
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => doc.data());
      
      if (data.length === 0) {
        // Fallback dummy data if leaderboard is empty
        setLeaders([
          { user_id: '1', display_name: 'ChemWhiz99', total_score: 12500, quizzes_taken: 45 },
          { user_id: '2', display_name: 'AtomSmasher', total_score: 9800, quizzes_taken: 32 },
          { user_id: '3', display_name: 'MarieCurieFan', total_score: 8750, quizzes_taken: 28 },
          { user_id: '4', display_name: 'Guest', total_score: 5000, quizzes_taken: 15 },
        ]);
      } else {
        setLeaders(data);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [view]);

  // Filter out users who haven't taken any quizzes (though the query sort should mostly handle this)
  const displayLeaders = leaders.filter(l => l.total_score > 0);

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            Top <span style={{ color: C.indigo }}>Chemists</span>
          </h1>
          <p style={{ fontSize: 16, color: C.sub, margin: '0 auto', maxWidth: 500, lineHeight: 1.6 }}>
            Compete with students worldwide. Take quizzes to climb the ranks!
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ background: C.white, borderRadius: 999, padding: 4, display: 'inline-flex', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', border: `1px solid ${C.border}` }}>
            <button 
              onClick={() => setView('weekly')}
              style={{
                padding: '8px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                background: view === 'weekly' ? C.indigo : 'transparent',
                color: view === 'weekly' ? C.white : C.sub,
              }}
            >
              This Week
            </button>
            <button 
              onClick={() => setView('all_time')}
              style={{
                padding: '8px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                background: view === 'all_time' ? C.indigo : 'transparent',
                color: view === 'all_time' ? C.white : C.sub,
              }}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.sub }}>Loading leaderboard...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', padding: '16px 24px', background: '#f8fafc', borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>
                <div style={{ width: 60, textAlign: 'center' }}>Rank</div>
                <div style={{ flex: 1 }}>Chemist</div>
                <div style={{ width: 100, textAlign: 'center' }}>Quizzes</div>
                <div style={{ width: 120, textAlign: 'right' }}>Score</div>
              </div>
              
              {displayLeaders.length > 0 ? displayLeaders.map((leader, i) => (
                <div key={i} style={{ 
                  display: 'flex', padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
                  alignItems: 'center', background: i < 3 ? (i === 0 ? '#fffbeb' : i === 1 ? '#f8fafc' : '#fff7ed') : C.white
                }}>
                  <div style={{ width: 60, textAlign: 'center', fontSize: 18, fontWeight: 900, color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : C.text }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
                      @{leader.username || leader.name || 'Anonymous'}
                    </div>
                    {leader.location && (
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.sub, marginTop: 2 }}>
                        📍 {leader.location}
                      </div>
                    )}
                  </div>
                  <div style={{ width: 100, textAlign: 'center', fontSize: 14, fontWeight: 600, color: C.sub }}>
                    {leader.quizzes_taken}
                  </div>
                  <div style={{ width: 120, textAlign: 'right', fontSize: 16, fontWeight: 800, color: C.indigo }}>
                    {leader.total_score.toLocaleString()} <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>pts</span>
                  </div>
                </div>
              )) : (
                <div style={{ padding: 40, textAlign: 'center', color: C.sub }}>No scores yet for this period. Be the first!</div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
