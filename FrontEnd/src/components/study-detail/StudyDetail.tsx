import Footer from '../../Footer';
import { useParams } from 'react-router-dom';
import { useStudyList } from '../../hooks/useStudyList';
import MainContent from './MainContent';
import Sidebar from './Sidebar';

function StudyDetail() {
  const { data, isLoading, error } = useStudyList();
  const { id } = useParams();
  if (!id) return <div>유효하지 않은 스터디 ID 입니다.</div>;
  if (isLoading) return <div>로딩중 입니다..</div>;
  if (error) return <div>문제가 발생했습니다. 다시 로그인하시거나 관리자에게 문의해주세요.</div>;
  if (!data || data.length === 0) return <div>스터디 목록 데이터가 유효하지 않습니다.</div>;

  const targetId = parseInt(id, 10);
  const selectedContent = data.find(content => targetId === content.id);
  if (!selectedContent) return <div>스터디 ID ({targetId}) 에 해당하는 상세 정보를 찾을 수 없습니다.</div>;
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          <MainContent data={selectedContent} />
          <Sidebar data={selectedContent} studyList={data}/>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudyDetail; // 내보내기 이름 변경 완료