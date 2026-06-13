import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import People from './pages/People';
import Programs from './pages/Programs';
import Activities from './pages/Activities';
import Funding from './pages/Funding';
import Team from './pages/Team';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/people" element={<People />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
