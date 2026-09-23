import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scale, ShieldCheck, Cookie, Info, MessageSquare } from 'lucide-react';

export default function LegalHeader({ title, description, lastUpdated = 'March 2026' }) {
  const tabs = [
    { to: '/about', label: 'About Us', icon: <Info size={15} /> },
    { to: '/contact', label: 'Contact Us', icon: <MessageSquare size={15} /> },
    { to: '/terms', label: 'Terms & Conditions', icon: <Scale size={15} /> },
    { to: '/privacy', label: 'Privacy Policy', icon: <ShieldCheck size={15} /> },
    { to: '/cookies', label: 'Cookie Policy', icon: <Cookie size={15} /> },
  ];

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Top Breadcrumb/Meta */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: '#6366f1',
          background: 'rgba(99, 102, 241, 0.08)',
          padding: '4px 12px',
          borderRadius: 99
        }}>
          <span>Valenzy Legal &amp; Policies</span>
        </div>

        <div style={{ fontSize: 13, color: '#64748b' }}>
          Last Updated: <strong>{lastUpdated}</strong>
        </div>
      </div>

      {/* Main Title & Description */}
      <h1 style={{
        fontSize: 'clamp(32px, 4vw, 44px)',
        fontWeight: 900,
        color: '#0f172a',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
        marginBottom: 12
      }}>
        {title}
      </h1>

      <p style={{
        fontSize: 16,
        color: '#64748b',
        lineHeight: 1.6,
        maxWidth: 750,
        marginBottom: 28
      }}>
        {description}
      </p>

      {/* Policy Switcher Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: 16
      }}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              background: isActive ? '#0f172a' : '#ffffff',
              color: isActive ? '#ffffff' : '#64748b',
              border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
              boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            })}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
