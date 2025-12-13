import axios from "axios";
import { getHeaders } from "../context/AxiosConfig";
import { ParticipantStatus, StudyData, UserLogin, UserRegister } from "../type";

export const getData = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study/me`, getHeaders());
  return response.data;
}
export const getChatData = async (studyId: number) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study/${studyId}/messages`, getHeaders());
  return response.data;
}

export const getLocation = async (data: { address: string }) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/vworld`,
    {
      params: {
        address: data.address,
      },
    }
  );


  const result = response.data.results[0];
  return result.geometry.location;
}

export const changeLocation = async (data: { address: string }, location: { lat: number, lng: number }) => {
  await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/user/address`,
    {
      address: data.address,
      longitude: location.lng,
      latitude: location.lat,
    },
    getHeaders()
  );
}

export const createStudy = async (studyData: StudyData) => {
  await axios.post(`${import.meta.env.VITE_BASE_URL}/study`, studyData, getHeaders());
}

export const participantStatusChange = async (studyId: number, senderId: number, status: ParticipantStatus) => {
  await axios.put(`${import.meta.env.VITE_BASE_URL}/participant/${studyId}`, {
    userId: senderId,
    status: status
  }, getHeaders())
}

export const joinStudy = async (id: number) => {
  await axios.post(`${import.meta.env.VITE_BASE_URL}/participant/${id}`, null, getHeaders());
}

export const changeStudyImg = async (formData: FormData, studyId: number | undefined) => {
  await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/study/${studyId}/study-image`,
    formData,
    {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export const changeProfileImg = async (formData: FormData) => {
  await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/user/profile-image`,
    formData,
    {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/user/password`,
    {
      currentPassword,
      newPassword,
    },
    getHeaders()
  );
}

export const changeUserInfo = async (nick: string, des: string) => {
  await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/user/info`,
    { nickname: nick, description: des },
    getHeaders()
  );
}

export const getUserInfo = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/user/me`,
    getHeaders()
  );
  return response;
}

export const pushSubscribe = async (sub: PushSubscription) => {
  await axios.post(
    `${import.meta.env.VITE_BASE_URL}/push/subscribe`,
    {
      endpoint: sub.endpoint,
      keys: sub.toJSON().keys, // { p256dh, auth }
    },
    getHeaders()
  );
}

export const getNotification = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/notifications`, getHeaders());
  return response;
}

export const readNotification = async (id: number) => {
  await axios.put(`${import.meta.env.VITE_BASE_URL}/notifications/${id}`, null, getHeaders());
}

export const readAllNotification = async () => {
  await axios.put(`${import.meta.env.VITE_BASE_URL}/notifications`, null, getHeaders());
}

export const deleteNotification = async (id: number) => {
  await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/notifications/${id}`,
    getHeaders()
  );

}

export const postLogin = async (user: UserLogin) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, user);
  return response;
}

export const postRegister = async (user: UserRegister) => {
  await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, user);
}

export const fetchStudyList = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study`, getHeaders());
  return response.data;
};