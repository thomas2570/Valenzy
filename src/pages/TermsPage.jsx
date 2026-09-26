import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import LegalHeader from '../components/LegalHeader';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  AlertCircle, 
  Mail, 
  MessageSquare,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function TermsPage() {
  const { dispatch } = useAppContext();

  const SECTIONS = [
    {
      num: 1,
      title: 'Use of the Site',
      content: 'Valenzy is provided for educational and informational purposes. You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use of the Site. You must not misuse the Site by knowingly introducing viruses, malware, or other harmful material.'
    },
    {
      num: 2,
      title: 'Intellectual Property',
      content: 'All content on this Site, including but not limited to text, graphics, logos, interactive tools, 3D models (including the Molecule Builder and Virtual Lab), worksheets, leaderboards, and software, is the property of Valenzy or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on this Site without our prior written consent, except for personal, non-commercial educational use.'
    },
    {
      num: 3,
      title: 'User Accounts',
      content: 'If the Site allows you to create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.'
    },
    {
      num: 4,
      title: 'Accuracy of Content & Tools',
      content: 'While we strive to ensure that the chemistry data, calculations (including molar mass, equation balancing, and gas laws), and educational content on Valenzy are accurate and up to date, we make no warranties or guarantees regarding the completeness, reliability, or accuracy of any information on the Site. Users should independently verify critical information before relying on it for academic, laboratory, or professional purposes.'
    },
    {
      num: 5,
      title: 'Limitation of Liability',
      content: 'Valenzy shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, the Site, including but not limited to errors, omissions, interruptions, delays, or inaccuracies in calculation tools.'
    },
    {
      num: 6,
      title: 'Third-Party Links',
      content: 'Our Site may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party sites.'
    },
    {
      num: 7,
      title: 'Changes to These Terms',
      content: 'We reserve the right to modify or replace these Terms & Conditions at any time. Continued use of the Site after any changes constitutes acceptance of the new terms.'
    },
    {
      num: 8,
      title: 'Governing Law',
      content: 'These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.'
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
          title="Terms & Conditions"
          description="These Terms & Conditions govern your access to and use of Valenzy. By accessing or using our website, you agree to be bound by these terms."
          lastUpdated="2026"
        />

        {/* Preamble notice */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
            border: '1px solid #dbeafe',
            borderRadius: 20,
            padding: 24,
            marginBottom: 36,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16
          }}
        >
          <div style={{ color: '#3b82f6', marginTop: 2 }}>
            <AlertCircle size={22} />
          </div>
          <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.65 }}>
            <strong>Agreement to Terms:</strong> These Terms &amp; Conditions govern your access to and use of Valenzy (the &ldquo;Site,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, please discontinue use of the Site.
          </div>
        </motion.div>

        {/* Sections */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
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
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingLeft: 40 }}>
                {sec.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Questions Box */}
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
              Questions about these Terms?
            </h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              For questions or clarifications regarding our Terms &amp; Conditions, our support team is available.
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
