import { MapPin, Code2, MessagesSquare } from "lucide-react";

const FeatureCard = ({ icon, title, description }:{ icon: React.ReactNode; title: string; description: string; }
) => (
  <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-2xl flex flex-col items-center text-center">
    {/* 아이콘 컨테이너 */}
    <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-50 border-4 border-indigo-100 text-indigo-600">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// 개별 작동 단계 컴포넌트
const Step = ({ number, title, description }: {number: string; title: string; description: string;}) => (
  <div className="flex flex-col items-center text-center p-4">
    {/* 단계 번호 원 */}
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold mb-3">
      {number}
    </div>
    <h4 className="text-md font-semibold mb-1 text-gray-800">{title}</h4>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);


function FeatureSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            왜 StudyHub인가요?
          </h2>
          <p className="text-xl text-gray-600">
            개발자와 학생들을 위한 최고의 스터디 매칭 서비스
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<MapPin className="w-8 h-8" />}
            title="위치 기반 매칭"
            description="현재 위치를 기준으로 주변 스터디 그룹을 찾아 모으세요. 모여서 스터디 진행이 편리합니다."
          />
          <FeatureCard
            icon={<Code2 className="w-8 h-8" />}
            title="기술 스택 매칭"
            description="관심 있는 기술과 학습 목표가 비슷한 사람들을 찾아 효율을 높이고 공부하세요."
          />
          <FeatureCard
            icon={<MessagesSquare className="w-8 h-8" />}
            title="실시간 소통"
            description="WebSocket 기반 실시간 채팅 기능으로 원활한 커뮤니케이션을 제공합니다."
          />
        </div>

        {/* -------------------- 2. 어떻게 작동하나요? -------------------- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            어떻게 작동하나요?
          </h2>
          <p className="text-xl text-gray-600">
            간단한 3단계로 시작하는 스터디 매칭
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:space-x-8 relative">

          {/* 단계 카드들 */}
          <Step
            number="1"
            title="프로필 등록"
            description="관심 기술 스택/위치 정보를 등록하여 맞춤형 매칭을 받아보세요."
          />

          <Step
            number="2"
            title="스터디 검색"
            description="키워드, 기술 태그, 위치 등 다양한 조건으로 원하는 스터디를 찾아 매칭하세요."
          />

          <Step
            number="3"
            title="참여 & 소통"
            description="스터디에 참여 신청하고 실시간 채팅으로 멤버들과 소통하며 함께 성장하세요."
          />
        </div>

      </div>
    </section>
  );
}

export default FeatureSection;