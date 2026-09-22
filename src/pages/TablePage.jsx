import React, { useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import PeriodicTable from '../components/PeriodicTable';
import ElementSidebar from '../components/ElementSidebar';
import { useAppContext } from '../context/AppContext';

export default function TablePage() {
  const { state } = useAppContext();

  useEffect(() => {
    document.body.style.overflow = state.selectedElement ? 'hidden' : 'unset';
  }, [state.selectedElement]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 80% 60% at 10% 100%, #dbeafe44 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 90% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 1700, margin: '0 auto', padding: '24px 20px 80px' }}>
        <FilterBar />
        <PeriodicTable />

        <footer style={{ marginTop: 80, textAlign: 'center', color: '#64748b', fontSize: 13, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
          <div>
            Built and designed by <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #84cc16 50%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Thomas Ramesh</span>
          </div>
          <div style={{ marginTop: 4 }}>&copy; 2026 Valenzy. All rights reserved.</div>
        </footer>
      </div>
      <ElementSidebar />
    </div>
  );
}
