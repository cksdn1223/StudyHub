// src/context/MyStudyContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage, MyStudyList } from "../type"; // 경로 맞게 수정
import { getData, getChatData } from "../api/api";

type MyStudyContextValue = {
  myStudyList: MyStudyList[];
  isLoading: boolean;
  error: unknown;
  chatList: ChatMessage[];
  chatListLoading: boolean;
  chatListError: unknown;
  selectStudy: MyStudyList | null;
  setSelectStudy: (study: MyStudyList | null) => void;
};

const MyStudyContext = createContext<MyStudyContextValue | null>(null);

export const MyStudyProvider = ({ children }: React.PropsWithChildren) => {
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(null);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<MyStudyList[]>({
    queryKey: ["myStudyList"],
    queryFn: getData,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (!data.length) return;
    const exists = data.some((s) => s.studyId === selectedStudyId);
    if (selectedStudyId == null || !exists) {
      setSelectedStudyId(data[0].studyId);
    }
  }, [data, selectedStudyId]);
  const selectStudy = useMemo(
    () => data?.find((s) => s.studyId === selectedStudyId) ?? null,
    [data, selectedStudyId]
  );
  const { data: chatList = [], isLoading: chatListLoading, error: chatListError } = useQuery<ChatMessage[]>({
    queryKey: ['chatList', selectedStudyId],
    queryFn: () => {
      if (!selectedStudyId) {
        throw new Error('studyId가 없습니다.');
      }
      return getChatData(selectedStudyId);
    },
    enabled: !!selectedStudyId,
    refetchOnWindowFocus: false,
  })

  return (
    <MyStudyContext.Provider
      value={{
        myStudyList: data,
        isLoading,
        error,
        chatList,
        chatListLoading,
        chatListError,
        selectStudy,
        setSelectStudy: (study: MyStudyList | null) =>
          setSelectedStudyId(study ? study.studyId : null),
      }}
    >
      {children}
    </MyStudyContext.Provider>
  );
};

export const useMyStudy = () => {
  const ctx = useContext(MyStudyContext);
  if (!ctx) {
    throw new Error("useMyStudy는 MyStudyProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
};
