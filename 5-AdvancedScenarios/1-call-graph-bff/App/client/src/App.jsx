import { PageLayout } from './components/PageLayout';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';

import './styles/App.css';

const Pages = () => {
    return (
        <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <PageLayout account={null}>
                <Pages />
            </PageLayout>
        </AuthProvider>
    );
};

export default App;