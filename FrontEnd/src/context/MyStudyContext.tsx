import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ChatMessage, MyStudyList } from "../type";
import { useMyStudyListQuery } from "../hooks/queries/useMyStudyListQuery";
import { useChatListQuery } from "../hooks/queries/useChatListQuery";

type MyStudyContextValue = {
  myStudyList: MyStudyList[];
  isLoading: boolean;
  error: unknown;

  chatList: ChatMessage[];
  chatListLoading: boolean;
  chatListError: unknown;

  selectStudy: MyStudyList | null;
  setSelectStudy: (study: MyStudyList | null) => void;
  selectedStudyId: number | null;
};

const MyStudyContext = createContext<MyStudyContextValue | null>(null);

export const MyStudyProvider = ({ children }: React.PropsWithChildren) => {
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(null);
  const enabled = !!localStorage.getItem("studyhub_jwt");

  const { data: myStudyList = [], isLoading, error } = useMyStudyListQuery(enabled);
  const { data: chatList = [], isLoading: chatListLoading, error: chatListError } = useChatListQuery(selectedStudyId);
  
  useEffect(() => {
    if (!myStudyList.length) return;
    const exists = myStudyList.some((s) => s.studyId === selectedStudyId);
    if (selectedStudyId == null || !exists) {
      setSelectedStudyId(myStudyList[0].studyId);
    }
  }, [myStudyList, selectedStudyId]);

  const selectStudy = useMemo(
    () => myStudyList?.find((s) => s.studyId === selectedStudyId) ?? null,
    [myStudyList, selectedStudyId]
  );
  

  return (
    <MyStudyContext.Provider
      value={{
        myStudyList,
        isLoading,
        error,
        chatList,
        chatListLoading,
        chatListError,
        selectStudy,
        selectedStudyId,
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
