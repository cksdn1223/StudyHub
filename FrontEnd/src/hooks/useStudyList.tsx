import { useQuery } from '@tanstack/react-query';
import { StudyList } from '../type';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchStudyList } from '../api/api';



/**
 * 스터디 목록 데이터를 가져오는 커스텀 훅
 * @returns {object} data, isLoading, error
 */
export const useStudyList = () => {
  const { data, isLoading, error } = useQuery<StudyList[]>({
    queryKey: ['studyList'],
    queryFn: fetchStudyList,
    staleTime: 1000 * 60 * 5,
  });

  const formattedData = data?.map(study => {
    const dateObject = parseISO(study.createdAt);
    const timeAgo = formatDistanceToNow(dateObject, {
      addSuffix: true,
      locale: ko,
    });

    return {
      ...study,
      formattedCreatedAt: timeAgo
    };
  });

  return { data: formattedData, isLoading, error };
};