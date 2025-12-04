import { AxiosRequestConfig } from "axios";

export const getHeaders = (): AxiosRequestConfig => {
    const jwtToken = localStorage.getItem("studyhub_jwt");
    const token = jwtToken ? jwtToken : "";

    return {
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
    };
  };