import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  User, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  Loader2,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: "'Inter', sans-serif",
      color: '#0f172a',
      padding: '48px 24px 80px',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 99,
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#4f46e5',
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 16
          }}>
            <MessageSquare size={15} />
            <span>Get in Touch</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 44px)',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            color: '#0f172a',
            marginBottom: 12
          }}>
            Contact Valenzy
          </h1>

          <p style={{
            fontSize: 16,
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: 580,
            margin: '0 auto'
          }}>
            Have a question, feedback on chemistry calculations, feature requests, or partnership inquiries? Send us a message and we will get back to you.
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 'clamp(28px, 4vw, 40px)',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
            marginBottom: 40
          }}
        >
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.25)'
              }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                Message Sent Successfully!
              </h3>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, maxWidth: 440, margin: '0 auto 28px' }}>
                Thank you for contacting us. We have received your message and will review your inquiry shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                style={{
                  padding: '12px 28px',
                  borderRadius: 12,
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {errorMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {/* Name */}
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
                        padding: '12px 14px 12px 42px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        fontSize: 14,
                        color: '#0f172a',
                        outline: 'none'
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    />
                  </div>
                </div>

                {/* Email */}
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
                        padding: '12px 14px 12px 42px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        fontSize: 14,
                        color: '#0f172a',
                        outline: 'none'
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Topic */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Subject / Category
                </label>
                <select
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
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

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Your Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type your message, suggestion, or question..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: 14,
                    color: '#0f172a',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: 120,
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#ffffff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSending}
                style={{
                  padding: '16px',
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
                  gap: 10,
                  boxShadow: '0 8px 25px -4px rgba(15, 23, 42, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={e => { if (!isSending) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { if (!isSending) e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {isSending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending Your Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Feature summary cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: 20,
            border: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 14
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Quick Response</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>We review all community notes</div>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: 20,
            border: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 14
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Direct to Inbox</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Sent safely via Formspree</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
