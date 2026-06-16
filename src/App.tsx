import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PracticeSetup from './pages/PracticeSetup';
import PracticeSession from './pages/PracticeSession';
import Results from './pages/Results';
import Statistics from './pages/Statistics';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/practicar" element={<PracticeSetup />} />
              <Route path="/sesion" element={<PracticeSession />} />
              <Route path="/resultados" element={<Results />} />
              <Route path="/estadisticas" element={<Statistics />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProgressProvider>
    </ThemeProvider>
  );
}
