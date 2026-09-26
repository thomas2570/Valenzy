import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import TablePage from './pages/TablePage';
import BalancerPage from './pages/BalancerPage';
import ToolsPage from './pages/ToolsPage';
import MolarMassPage from './pages/MolarMassPage';
import SolubilityPage from './pages/SolubilityPage';
import GasLawsPage from './pages/GasLawsPage';
import IonsPage from './pages/IonsPage';
import SettingsPage from './pages/SettingsPage';
import VirtualLabPage from './pages/VirtualLabPage';
import WorksheetPage from './pages/WorksheetPage';
import QuizPage from './pages/QuizPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ContactPage from './pages/ContactPage';
import MoleculeBuilderPage from './pages/MoleculeBuilderPage';
import AuthPage from './pages/AuthPage';
import ProgressPage from './pages/ProgressPage';
import FormulaSheetPage from './pages/FormulaSheetPage';
import MnemonicPage from './pages/MnemonicPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MoleculeGalleryPage from './pages/MoleculeGalleryPage';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import DesktopWarningModal from './components/DesktopWarningModal';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen relative z-0">
          <Navbar />
          <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/table" element={<TablePage />} />
                <Route path="/ions" element={<IonsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/balancer" element={<BalancerPage />} />
                <Route path="/molar-mass" element={<MolarMassPage />} />
                <Route path="/solubility" element={<SolubilityPage />} />
                <Route path="/gas-laws" element={<GasLawsPage />} />
                <Route path="/virtual-lab" element={<VirtualLabPage />} />
                <Route path="/worksheet" element={<WorksheetPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/cookies" element={<CookiePolicyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/molecule-builder" element={<MoleculeBuilderPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/formulas" element={<FormulaSheetPage />} />
                <Route path="/mnemonics" element={<MnemonicPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/gallery" element={<MoleculeGalleryPage />} />
              </Routes>
          </main>
          <Footer />
          <ContactModal />
          <DesktopWarningModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
