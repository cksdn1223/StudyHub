// src/context/MyStudyContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MyStudyList } from "../type"; // 경로 맞게 수정
import axios from "axios";
import { getHeaders } from "./AxiosConfig";

type MyStudyContextValue = {
  myStudyList: MyStudyList[];
  isLoading: boolean;
  error: unknown;
  selectStudy: MyStudyList | null;
  setSelectStudy: (study: MyStudyList | null) => void;
};

const MyStudyContext = createContext<MyStudyContextValue | null>(null);

const getData = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study/me`, getHeaders());
  return response.data;
}

export const MyStudyProvider = ({ children }: React.PropsWithChildren) => {
  const [selectStudy, setSelectStudy] = useState<MyStudyList | null>(null);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<MyStudyList[]>({
    queryKey: ["myStudyList"],
    queryFn: getData,
    refetchOnWindowFocus: false,
  });

  return (
    <MyStudyContext.Provider
      value={{
        myStudyList: data,
        isLoading,
        error,
        selectStudy,
        setSelectStudy,
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
