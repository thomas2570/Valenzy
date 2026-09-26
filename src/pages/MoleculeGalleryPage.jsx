import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';

const C = {
  indigo: '#6366f1', indigoDark: '#4f46e5', indigoLight: '#e0e7ff',
  green: '#10b981', greenLight: '#d1fae5',
  text: '#111827', sub: '#6b7280', border: '#e5e7eb', white: '#ffffff',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

export default function MoleculeGalleryPage() {
  const { state: { user } } = useAppContext();
  const [molecules, setMolecules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form state
  const [formula, setFormula] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchGallery();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const fetchGallery = () => {
    setLoading(true);
    const q = query(collection(db, 'molecule_gallery'), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (data.length === 0) {
        // Dummy data if empty
        setMolecules([
          { id: 1, formula: 'H2O', submitted_by: 'ChemWhiz99', image_url: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=400&q=80', likes: 12 },
          { id: 2, formula: 'C6H12O6', submitted_by: 'MarieCurieFan', image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80', likes: 8 },
        ]);
      } else {
        setMolecules(data);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to submit a molecule.');
    
    setSubmitting(true);
    try {
      // Placeholder submission - in the future this will receive geometry and snapshot from the Molecule Builder
      await addDoc(collection(db, 'molecule_gallery'), {
        formula,
        submitted_by: user.email?.split('@')[0] || 'Unknown User',
        geometry: '{}', // Placeholder
        image_url: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=400&q=80', // Placeholder
        likes: 0,
        created_at: new Date().toISOString()
      });
      
      setShowSubmitModal(false);
      setFormula('');
    } catch (error) {
      console.error('Error submitting molecule:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80 }}>
      
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: C.white, borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800 }}>Submit Your Molecule</h2>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 24 }}>
              (Placeholder Form) Once the Molecule Builder is complete, this will automatically capture your 3D creation.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Chemical Formula</label>
                <input 
                  type="text" 
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="e.g. H2O, CH4"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowSubmitModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.white, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: C.indigo, color: C.white, fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
              Molecule <span style={{ color: C.indigo }}>Gallery</span>
            </h1>
            <p style={{ fontSize: 16, color: C.sub, margin: 0 }}>
              Explore beautiful 3D molecules built by the community.
            </p>
          </div>
          
          <button 
            onClick={() => {
              if (!user) alert("Please sign in to submit a molecule.");
              else setShowSubmitModal(true);
            }}
            style={{
              padding: '12px 24px', borderRadius: 12, border: 'none',
              background: C.indigo, fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + Submit Molecule
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', color: C.sub, padding: 60 }}>Loading gallery...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {molecules.map((mol, i) => (
              <div key={i} style={{ 
                background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, 
                overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' 
              }}>
                <div style={{ height: 200, background: '#f8fafc', backgroundImage: `url(${mol.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 4 }}>{mol.formula}</div>
                  <div style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>Built by <span style={{ fontWeight: 600, color: C.indigo }}>{mol.submitted_by}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.sub, fontSize: 14, fontWeight: 600 }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      {mol.likes}
                    </div>
                    <button style={{ background: C.indigoLight, color: C.indigo, border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      View 3D
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
