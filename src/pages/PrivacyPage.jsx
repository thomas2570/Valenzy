import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import LegalHeader from '../components/LegalHeader';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Baby, 
  RefreshCw, 
  UserCheck, 
  Mail, 
  MessageSquare,
  CheckCircle2, 
  Check 
} from 'lucide-react';

export default function PrivacyPage() {
  const { dispatch } = useAppContext();

  const HIGHLIGHTS = [
    { title: 'No Data Selling', desc: 'We never sell, rent, or trade personal data to third parties.', icon: <EyeOff size={20} color="#10b981" /> },
    { title: 'Educational Safety', desc: 'Built for students with strict privacy-first protection.', icon: <Baby size={20} color="#6366f1" /> },
    { title: 'Secure Encryption', desc: 'Industry-standard encryption and security measures.', icon: <Lock size={20} color="#f59e0b" /> }
  ];

  const SECTIONS = [
    {
      num: 1,
      title: 'Information We Collect',
      body: (
        <p>
          We may collect personal information such as your name and email address when you voluntarily provide it &mdash; for example, by contacting us, subscribing to updates, or creating an account. We may also automatically collect non-personal information such as browser type, device information, pages visited, and time spent on the Site through standard analytics tools.
        </p>
      )
    },
    {
      num: 2,
      title: 'How We Use Your Information',
      body: (
        <div>
          <p style={{ marginBottom: 12 }}>We use the information we collect to:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve and personalize your experience on the Site</li>
            <li>Analyze usage trends to enhance our features and content</li>
            <li>Send occasional updates or educational content, if you have opted in</li>
          </ul>
        </div>
      )
    },
    {
      num: 3,
      title: 'Data Sharing',
      body: (
        <p>
          We do not sell, rent, or trade your personal information to third parties. We may share information with trusted service providers who help us operate the Site (such as hosting or analytics providers), but only to the extent necessary for them to perform their services, and under confidentiality obligations.
        </p>
      )
    },
    {
      num: 4,
      title: 'Data Security',
      body: (
        <p>
          We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      )
    },
    {
      num: 5,
      title: 'Your Rights',
      body: (
        <p>
          Depending on your location, you may have the right to access, correct, or request deletion of your personal data. To exercise these rights, please reach out to us using our Contact Us form.
        </p>
      )
    },
    {
      num: 6,
      title: "Children's Privacy",
      body: (
        <p>
          Valenzy is designed to be educational and may be used by students under the age of 18. We do not knowingly collect personal information from children without appropriate parental or guardian consent, in accordance with applicable laws.
        </p>
      )
    },
    {
      num: 7,
      title: 'Changes to This Policy',
      body: (
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
      )
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: "'Inter', sans-serif",
      color: '#0f172a',
      padding: '48px 24px 80px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <LegalHeader
          title="Privacy Policy"
          description="At Valenzy, we respect your privacy and are committed to protecting any personal information you share with us."
          lastUpdated="2026"
        />

        {/* Highlights Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 36
        }}>
          {HIGHLIGHTS.map(h => (
            <div
              key={h.title}
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: 18,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 4px 15px -4px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {h.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                  {h.title}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>
                  {h.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          {SECTIONS.map((sec) => (
            <motion.div
              key={sec.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: sec.num * 0.04 }}
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '28px 32px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800
                }}>
                  {sec.num}
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                  {sec.title}
                </h2>
              </div>
              <div style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingLeft: 40 }}>
                {sec.body}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact info box */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: 32,
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Questions about this Privacy Policy?
            </h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              If you have questions, data inquiries, or wish to exercise your rights, please reach out to us.
            </p>
          </div>

          <button
            onClick={() => dispatch({ type: 'OPEN_CONTACT' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 12,
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <MessageSquare size={16} />
            <span>Contact Us</span>
          </button>
        </div>
      </div>
    </div>
  );
}
