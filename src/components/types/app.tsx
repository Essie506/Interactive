/**
 * =============================================================================
 * ⚠️ ROUTING CONFIGURATION
 * =============================================================================
 * 
 * 🔧 FOR PRODUCTION DEPLOYMENT:
 * 1. In src/config/devMode.ts, set DEV_MODE = false
 * 2. The "/" route will redirect to "/calendar" (see below)
 * 3. Table of Contents page will be hidden
 * 
 * Routes:
 * - "/" -> Table of Contents (dev) or redirect to /calendar (prod)
 * - "/calendar" -> Main calendar view
 * - "/settings" -> User settings
 * - "/auth" -> Login/signup
 * 
 * =============================================================================
 */
import { Routes, Route, Navigate } from 'react-router';
import Calendar from '@/pages/Calendar';
import Auth from '@/pages/Auth';
import Settings from '@/pages/Settings';
import Insights from '@/pages/Insights';

export default function App() {
  return (
    <Routes>
      {/* 
        🔧 HOME ROUTE:
        - In DEV_MODE: Shows Table of Contents
        - In PRODUCTION: Redirects to /calendar
      */}
      <Route path="/" element={<Navigate to="/calendar" replace />} />
      
      {/* Main app routes */}
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
