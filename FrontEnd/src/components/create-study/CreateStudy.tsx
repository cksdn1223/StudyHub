import { ChevronLeft } from "lucide-react";
import Card from "../public/Card";
import InputField from "../public/InputField";
import SelectField from "../public/SelectField";
import StudyPreview from "./StudyPreview";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { createStudy } from "../../api/api";
import { useToast } from "../../context/ToastContext";
import { useStudyForm } from "./useStudyForm";
import { useAddressSearch } from "./useAddressSearch";
import { useTagSelector } from "./useTagSelector";
import { TagSection } from "./TagSection";
import { AddressSection } from "./AddressSection";
import { StudyFormValues } from "./studySchema";


const tagList = [
  // 프론트엔드 (Frontend)
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
  'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
  'Styled Components', 'Recoil', 'Redux', 'Zustand', 'Webpack',
  'Babel',

  // 백엔드 (Backend)
  'Spring Boot', 'Node.js', 'Express.js', 'NestJS', 'Django',
  'Flask', 'Go', 'Ktor', 'Kotlin', 'Java', 'Python', 'C#',
  'PHP', 'Ruby on Rails',

  // 데이터베이스 & 캐시 (DB & Cache)
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle',
  'MariaDB', 'SQLAlchemy', 'Prisma', 'TypeORM',

  // 클라우드 & 인프라 (Cloud & Infra)
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Terraform', 'Jenkins', 'CI/CD', 'Nginx', 'Apache',

  // 모바일 & 기타
  'Flutter', 'React Native', 'Swift', 'Kotlin (Android)',
  'Git', 'GitHub Actions', 'Jira', 'Figma'
];

function CreateStudy() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useStudyForm();

  const { isAddressLoading, openAddress } = useAddressSearch(setValue);

  const tagSelector = useTagSelector(tagList, showToast, watch, setValue);

  const title = watch("title");
  const description = watch("description");
  const memberCount = watch("memberCount");
  const maxMembers = watch("maxMembers");
  const frequency = watch("frequency");
  const duration = watch("duration");
  const detailLocation = watch("detailLocation");
  const address = watch("address");
  const detailAddress = watch("detailAddress");

  const onSubmit = async (data: StudyFormValues) => {
    await createStudy(data); // 스키마 통과된 값만 들어옴
    showToast("스터디가 성공적으로 생성되었습니다.", "success");
    navigate("/find");
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center pb-6 border-b border-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-700 cursor-pointer mr-3" onClick={() => navigate("/find")} />
          <h1 className="text-xl font-bold text-gray-800">스터디 만들기</h1>
        </div>

        <p className="text-gray-500 mt-2">새로운 스터디를 만들고 함께할 팀원들을 모집해보세요</p>

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <Card title="기본 정보">
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <InputField
                    id="title"
                    label="스터디 제목"
                    placeholder="예: React 심화 스터디 모집합니다"
                    required
                    {...field}
                    onBlur={() => field.onBlur()}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <InputField
                    id="description"
                    label="스터디 설명"
                    placeholder="스터디의 목표, 진행 방식, 예상 커리큘럼 등을 자세히 작성해주세요."
                    rows={5}
                    required
                    {...field}
                    onBlur={() => field.onBlur()}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </Card>

            <Card title="스터디 설정">
              <div className="flex gap-4 items-end">
                <div className="w-1/2">
                  <label className="text-sm font-semibold text-gray-800">모집 인원</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="number"
                      min="1"
                      disabled
                      value={memberCount}
                      className="w-1/2 px-4 py-3 border border-gray-300 rounded-l-lg text-sm text-center"
                    />
                    <span className="px-2 py-3 text-gray-500">/</span>
                    <input
                      type="number"
                      min="1"
                      value={maxMembers}
                      onChange={(e) => setValue("maxMembers", Number(e.target.value), { shouldValidate: true })}
                      className="w-1/2 px-4 py-3 border border-gray-300 rounded-r-lg text-sm text-center"
                    />
                    <span className="ml-1 text-sm text-gray-600">명</span>
                  </div>
                  {errors.maxMembers?.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.maxMembers.message as string}</p>
                  )}
                </div>

                <div className="w-1/2">
                  <Controller
                    control={control}
                    name="frequency"
                    render={({ field, fieldState }) => (
                      <SelectField
                        id="frequency"
                        label="진행 빈도"
                        defaultValue="선택해주세요"
                        options={["주 1회", "주 2회", "주 3회", "주 4회", "주 5회", "주 6회", "주 7회", "월 1회", "월 2회", "월 3회"]}
                        required
                        {...field}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Controller
                  control={control}
                  name="duration"
                  render={({ field, fieldState }) => (
                    <SelectField
                      id="duration"
                      label="예상 기간"
                      defaultValue="선택해주세요"
                      options={["1개월", "3개월", "6개월 이상"]}
                      required
                      {...field}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="detailLocation"
                  render={({ field, fieldState }) => (
                    <SelectField
                      id="detailLocation"
                      label="진행 방식"
                      defaultValue="오프라인"
                      options={["온라인", "오프라인", "온/오프라인 병행"]}
                      required
                      {...field}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Card>

            <Card title="기술 스택 태그">
              <TagSection {...tagSelector} />
              {errors.tags?.message && (
                <p className="mt-2 text-xs text-red-500">{errors.tags.message}</p>
              )}
            </Card>

            <Card title="모집 장소">
              <AddressSection
                address={address}
                detailAddress={detailAddress}
                onDetailChange={(e) => setValue("detailAddress", e.target.value)}
                isAddressLoading={isAddressLoading}
                openAddress={openAddress}
              />
              {errors.address?.message && (
                <p className="mt-2 text-xs text-red-500">{errors.address.message}</p>
              )}
            </Card>
          </div>

          <div className="lg:w-1/3 space-y-6">
            <StudyPreview
              title={title || "스터디 제목을 입력해주세요"}
              description={description || "스터디 설명을 입력해주세요"}
              memberCount={memberCount}
              maxMembers={maxMembers}
              frequency={frequency || "선택해주세요"}
              duration={duration || "선택해주세요"}
              detailLocation={detailLocation || "오프라인"}
            />
          </div>
        </div>

        <div className="flex justify-end pt-8 mt-10 border-t border-gray-200">
          <div className="space-x-4 flex">
            <button
              className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              onClick={() => navigate("/find")}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              className={`flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-lg transition
                ${isSubmitting ? "bg-gray-300 cursor-wait" : "bg-red-500 hover:bg-red-600"}`}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "생성 중..." : (
                <>
                  <span className="mr-1">+</span>
                  <span>스터디 만들기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStudy;