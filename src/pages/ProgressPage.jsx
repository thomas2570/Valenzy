import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const C = {
  indigo: '#6366f1', text: '#111827', sub: '#6b7280', border: '#e5e7eb', white: '#ffffff',
  green: '#10b981',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

export default function ProgressPage() {
  const { state: { user, userProfile } } = useAppContext();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', location: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      navigate('/login');
      return;
    }

    // Pre-fill form if profile exists
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        username: userProfile.username || '',
        location: userProfile.location || ''
      });
      if (userProfile.username && userProfile.location) {
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } else {
      setIsEditing(true);
    }

    const q = query(collection(db, "quiz_scores"), where("user_id", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let data = querySnapshot.docs.map(doc => doc.data());
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setScores(data || []);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userProfile, navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const uName = formData.username?.trim();
    const loc = formData.location?.trim();
    const fName = formData.name?.trim();

    if (!uName || !loc) {
      return alert("Please actually type a Username and Location! (The grey text is just an example)");
    }
    
    setSavingProfile(true);
    try {
      // Check if username already exists
      const usernameQuery = query(collection(db, "users"), where("username", "==", uName));
      const querySnapshot = await getDocs(usernameQuery);
      
      let isTaken = false;
      querySnapshot.forEach((docSnap) => {
        if (docSnap.id !== user.uid) { // Ignore their own current document if they are just updating name/location
          isTaken = true;
        }
      });

      if (isTaken) {
        alert(`The username "@${uName}" is already taken! Please choose a different one.`);
        setSavingProfile(false);
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        name: fName || '',
        username: uName,
        location: loc,
        email: user.email,
        updated_at: new Date().toISOString()
      }, { merge: true });
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to save profile:", e);
      alert("Failed to save profile. Please check your Firebase rules.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user || loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: '0 0 10px' }}>
              Account & Progress
            </h1>
            <p style={{ fontSize: 15, color: C.sub, margin: 0 }}>
              Welcome back, {userProfile?.name || user.email}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            style={{
              padding: '10px 20px', borderRadius: 12, border: `1px solid ${C.border}`,
              background: C.white, fontSize: 14, fontWeight: 600, color: C.text, cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>

        {/* PROFILE SECTION */}
        <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '32px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>My Profile</h2>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                style={{ padding: '6px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: C.indigo, margin: 0, fontWeight: 600 }}>Please fill out your details below to appear on the leaderboard!</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 8 }}>Full Name</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14 }} placeholder="e.g. Marie Curie" />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 8 }}>Username (Required)</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14 }} placeholder="e.g. ChemWhiz99" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 8 }}>Location / School (Required)</label>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14 }} placeholder="e.g. New York, USA" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" disabled={savingProfile} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: C.indigo, color: C.white, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
                {userProfile?.username && (
                  <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '14px 24px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.white, color: C.text, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginTop: 4 }}>@{userProfile?.username}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginTop: 4 }}>{userProfile?.location}</div>
              </div>
            </div>
          )}
        </div>

        {/* PROGRESS SECTION */}
        <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '32px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Recent Quiz Scores</h2>
          
          {scores.length === 0 ? (
            <p style={{ color: C.sub }}>You haven't taken any quizzes yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scores.map((score, i) => (
                <div key={score.id || i} style={{ padding: '16px', border: `1px solid ${C.border}`, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{score.topic}</div>
                    <div style={{ fontSize: 13, color: C.sub }}>{new Date(score.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.indigo }}>
                    {score.score} <span style={{ fontSize: 13, fontWeight: 500, color: C.sub }}>pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
