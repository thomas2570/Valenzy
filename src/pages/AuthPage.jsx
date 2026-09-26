import React, { useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const C = {
  indigo: '#6366f1', indigoDark: '#4f46e5', indigoLight: '#e0e7ff',
  text: '#111827', sub: '#6b7280', border: '#e5e7eb', white: '#ffffff',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

export default function AuthPage() {
  const { state: { user } } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/progress');
    }
  }, [user, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/progress');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
        navigate('/progress');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/progress');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: '0 0 10px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ fontSize: 15, color: C.sub, margin: 0 }}>
            {isLogin ? 'Sign in to track your progress' : 'Join to save your quiz scores and more'}
          </p>
        </div>

        <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '36px 40px' }}>
          
          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: 8, fontSize: 14, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = C.indigo}
                onBlur={(e) => e.target.style.borderColor = C.border}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = C.indigo}
                onBlur={(e) => e.target.style.borderColor = C.border}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%', marginTop: 8,
                background: loading ? C.sub : C.indigo, color: C.white, border: 'none',
                borderRadius: 14, padding: '14px 0', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s'
              }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <button 
            onClick={handleGoogle}
            style={{
              width: '100%', background: C.white, color: C.text, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '14px 0', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.background = C.white}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: C.indigo, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
