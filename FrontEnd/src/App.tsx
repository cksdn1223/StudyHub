import { Routes, Route } from 'react-router-dom';
import MainPage from './components/main/MainPage';
import FindStudy from './components/find-study/FindStudy';
import CreateStudy from './components/create-study/CreateStudy';
import AuthPage from './components/auth/AuthPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/find" element={<FindStudy />} />
        <Route path="/create" element={<CreateStudy />} />
        <Route path="/login" element={<AuthPage authType='login'/>} />
        <Route path="/register" element={<AuthPage authType='register' />} />
      </Routes>
    </div>
  );
}

export default App;