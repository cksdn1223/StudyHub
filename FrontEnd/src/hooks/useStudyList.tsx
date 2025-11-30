import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getHeaders } from '../context/AxiosConfig';
import { StudyList } from '../type';

const fetchStudyList = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study`, getHeaders());
  return response.data;
};

/**
 * 스터디 목록 데이터를 가져오는 커스텀 훅
 * @returns {object} data, isLoading, error
 */
export const useStudyList = () => {
  return useQuery<StudyList[]>({
    queryKey: ['studyList'],
    queryFn: fetchStudyList,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시된 데이터 사용
  });
};