import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SessionDashboard from './pages/Sessions';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Ambient background layers mounted globally across all view routes */}
      <div className="noise-overlay" />
      <div className="animated-grid" />
      <div className="aurora-blob aurora-cyan w-[500px] h-[500px] -top-24 -left-24" />
      <div className="aurora-blob aurora-purple w-[600px] h-[600px] -bottom-24 -right-24" />
      <div className="aurora-blob aurora-blue w-[700px] h-[700px] top-[20%] left-[25%]" />

      <BrowserRouter>
        <Routes>
          {/* Dashboard viewer session parsing route */}
          <Route path="/sessions/:id" element={<SessionDashboard />} />

          {/* Default fallback route for local prototype testing */}
          <Route path="*" element={<Navigate to="/sessions/demo-placeholder-token" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}