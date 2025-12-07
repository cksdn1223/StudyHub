import { Routes, Route } from 'react-router-dom';
import LayoutWrapper from './utils/LayoutWrapper';
import MainPage from './components/main/MainPage';
import FindStudy from './components/find-study/FindStudy';
import CreateStudy from './components/create-study/CreateStudy';
import AuthPage from './components/auth/AuthPage';
import StudyDetail from './components/study-detail/StudyDetail';
import Study from './components/study-info/Study';
import UserInfo from './components/user-info/UserInfo';

function App() {
  return (
    <div>
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
          element={<LayoutWrapper><Study /></LayoutWrapper>}
        />
        <Route
          path="/create"
          element={<LayoutWrapper><CreateStudy /></LayoutWrapper>}
        />
        <Route
          path="/auth/:type"
          element={<AuthPage />}
        />
        <Route
          path='/profile'
          element={<LayoutWrapper><UserInfo /></LayoutWrapper>}
        />
        <Route path="*" element={
          <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='font-bold text-2xl'>존재하지 않는 페이지 입니다. 새로고침 하시거나 돌아가 주세요.</h1>
            <a href="/" className='text-xl hover:text-blue-400'>돌아가기</a>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
