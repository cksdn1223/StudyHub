import { Routes, Route } from 'react-router-dom';
import LayoutWrapper from './utils/LayoutWrapper';
import MainPage from './components/main/MainPage';
import FindStudy from './components/find-study/FindStudy';
import CreateStudy from './components/create-study/CreateStudy';
import AuthPage from './components/auth/AuthPage';
import StudyDetail from './components/study-detail/StudyDetail';
import StudyInfo from './components/study/StudyInfo';
import NotificationSocketListener from './components/NotificationSocketListener';

function App() {
  return (
    <div>
      <NotificationSocketListener />
      <Routes>
        <Route
          path="/"
          element={<MainPage />}
        />
        <Route
          path="/find"
          element={<LayoutWrapper><FindStudy /></LayoutWrapper>}
        />
        <Route
          path="/study/:id"
          element={<LayoutWrapper><StudyDetail /></LayoutWrapper>}
        />
        <Route
          path="/chat"
          element={<LayoutWrapper><StudyInfo /></LayoutWrapper>}
        />
        <Route
          path="/create"
          element={<LayoutWrapper><CreateStudy /></LayoutWrapper>}
        />
        <Route
          path="/auth/:type"
          element={<AuthPage />}
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
