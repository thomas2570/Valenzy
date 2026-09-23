import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
  X, 
  Send, 
  User, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Loader2
} from 'lucide-react';

export default function ContactModal() {
  const { state, dispatch } = useAppContext();
  const isOpen = state.isContactOpen;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_CONTACT' });
    // Reset state after exit animation
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMsg('');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSending(true);
    setErrorMsg('');

    try {
      const response = await fetch('https://formspree.io/f/mnjoogrd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: formData.topic,
          message: formData.message.trim(),
          _subject: `Valenzy Contact: [${formData.topic}] from ${formData.name.trim()}`
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          topic: 'General Inquiry',
          message: ''
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMsg(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check your internet connection.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 520,
              background: '#ffffff',
              borderRadius: 24,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              fontFamily: "'Inter', sans-serif",
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1,
            }}
          >
            {/* Top Header */}
            <div style={{
              padding: '24px 28px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #6366f1 0%, #84cc16 50%, #f59e0b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Contact Valenzy
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
                    Send us your feedback, question, or suggestions
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                aria-label="Close modal"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
              {isSuccess ? (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '32px 16px' }}
                >
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#ecfdf5',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.25)'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                    Message Sent Successfully!
                  </h4>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 28px' }}>
                    Thank you for reaching out. We have received your message and will review it promptly.
                  </p>
                  <button
                    onClick={handleClose}
                    style={{
                      padding: '12px 28px',
                      borderRadius: 12,
                      background: '#0f172a',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: 14,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                /* Form View */
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {errorMsg && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      color: '#b91c1c',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Your Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: 14, color: '#94a3b8', pointerEvents: 'none' }}>
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marie Curie"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          fontSize: 14,
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'border-color 0.15s'
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Your Email ID <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: 14, color: '#94a3b8', pointerEvents: 'none' }}>
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="e.g. marie@domain.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          fontSize: 14,
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'border-color 0.15s'
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                      />
                    </div>
                  </div>

                  {/* Topic / Subject */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Subject / Category
                    </label>
                    <select
                      value={formData.topic}
                      onChange={e => setFormData({ ...formData, topic: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        fontSize: 14,
                        color: '#0f172a',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Suggestion & Feature Idea">Suggestion &amp; Feature Idea</option>
                      <option value="Bug Report or Calculation Error">Bug Report or Calculation Error</option>
                      <option value="Academic or Classroom Question">Academic or Classroom Question</option>
                      <option value="Partnership or Other">Partnership or Other</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Your Message <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Type your message, question, or suggestions here..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        fontSize: 14,
                        color: '#0f172a',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: 90,
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                      color: '#ffffff',
                      fontSize: 15,
                      fontWeight: 700,
                      border: 'none',
                      cursor: isSending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.25)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={e => { if (!isSending) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { if (!isSending) e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
