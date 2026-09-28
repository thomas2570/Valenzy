import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../utils/analytics';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // This will fire every time the route changes
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
