import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import LegalHeader from '../components/LegalHeader';
import { 
  Cookie, 
  Sliders, 
  BarChart3, 
  Settings2, 
  ExternalLink, 
  Mail, 
  MessageSquare,
  CheckCircle2, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function CookiePolicyPage() {
  const { dispatch } = useAppContext();

  const COOKIE_TYPES = [
    {
      title: 'Essential Cookies',
      desc: 'Necessary for the Site to function properly, such as remembering your session, theme, or display preferences. These cannot be disabled without affecting core functionality.',
      badge: 'Required',
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      icon: <ShieldCheck size={20} color="#dc2626" />
    },
    {
      title: 'Performance & Analytics Cookies',
      desc: 'Help us understand how visitors interact with the Site — which pages are visited most, how long users stay, and where improvements are needed. This data is aggregated and anonymized.',
      badge: 'Analytics',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      icon: <BarChart3 size={20} color="#2563eb" />
    },
    {
      title: 'Functionality Cookies',
      desc: 'Remember choices you make (such as language, calculator defaults, or display settings) to provide a more personalized, fluid learning experience.',
      badge: 'Preferences',
      badgeColor: '#16a34a',
      badgeBg: '#f0fdf4',
      icon: <Sliders size={20} color="#16a34a" />
    },
    {
      title: 'Third-Party Cookies',
      desc: 'Some features, such as embedded tools or external analytics services, may set their own cookies. We do not control these third-party cookies directly.',
      badge: 'Third-Party',
      badgeColor: '#9333ea',
      badgeBg: '#faf5ff',
      icon: <ExternalLink size={20} color="#9333ea" />
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
          title="Cookie Policy"
          description="This Cookie Policy explains how Valenzy uses cookies and similar technologies when you visit our website."
          lastUpdated="2026"
        />

        {/* Section 1: What Are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '28px 32px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)',
            marginBottom: 32
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
              1
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              What Are Cookies?
            </h2>
          </div>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingLeft: 40 }}>
            Cookies are small text files stored on your device by your web browser when you visit a website. They help websites remember your preferences, improve functionality, and gather information about how visitors use the site.
          </p>
        </motion.div>

        {/* Section 2: Types of Cookies We Use */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
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
              2
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Types of Cookies We Use
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            paddingLeft: 40
          }}>
            {COOKIE_TYPES.map((c) => (
              <div
                key={c.title}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: 24,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 15px -4px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: c.badgeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {c.icon}
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 99,
                    background: c.badgeBg,
                    color: c.badgeColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {c.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {c.title}
                </h3>

                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, flex: 1 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why We Use Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '28px 32px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)',
            marginBottom: 20
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
              3
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Why We Use Cookies
            </h2>
          </div>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingLeft: 40 }}>
            Cookies help us keep the Site secure, remember your preferences between visits, understand how our tools are being used, and continuously improve the learning experience we offer.
          </p>
        </motion.div>

        {/* Section 4: Managing Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '28px 32px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)',
            marginBottom: 20
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
              4
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Managing Cookies
            </h2>
          </div>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingLeft: 40 }}>
            Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, but doing so may affect the functionality of certain features on Valenzy. Instructions for managing cookies are typically found in your browser&apos;s &ldquo;Settings&rdquo; or &ldquo;Privacy&rdquo; section.
          </p>
        </motion.div>

        {/* Section 5: Changes to This Policy */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '28px 32px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)',
            marginBottom: 48
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
              5
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Changes to This Policy
            </h2>
          </div>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingLeft: 40 }}>
            We may update this Cookie Policy periodically to reflect changes in technology, regulation, or our practices. We encourage you to review this page occasionally.
          </p>
        </motion.div>

        {/* Contact box */}
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
              Questions about our use of cookies?
            </h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              If you have any questions about how cookies are used on Valenzy, please contact us.
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
