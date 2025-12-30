import { StudyFormValues } from "../schema/studySchema";
import { ParticipantStatus, UserLogin, UserRegister } from "../type";
import api from "./client";

export const getData = async () => {
  const response = await api.get(`/study/me`);
  return response.data;
}
export const getChatData = async (studyId: number) => {
  const response = await api.get(`/study/${studyId}/messages`);
  return response.data;
}

export const getLocation = async (data: { address: string }) => {
  const response = await api.get(
    `/vworld`,
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
  await api.patch(
    `/user/address`,
    {
      address: data.address,
      longitude: location.lng,
      latitude: location.lat,
    },
  );
}

export const createStudy = async (studyData: StudyFormValues) => {
  await api.post(`/study`, studyData);
}

export const participantStatusChange = async (studyId: number, senderId: number, status: ParticipantStatus) => {
  await api.put(`/participant/${studyId}`, {
    userId: senderId,
    status: status
  })
}

export const joinStudy = async (id: number) => {
  await api.post(`/participant/${id}`, null);
}

export const changeStudyImg = async (formData: FormData, studyId: number | undefined) => {
  await api.patch(
    `/study/${studyId}/study-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export const changeProfileImg = async (formData: FormData) => {
  await api.patch(
    `/user/profile-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  await api.patch(
    `/user/password`,
    {
      currentPassword,
      newPassword,
    },
    { skipAuthLogout: true }
  );
}

export const changeUserInfo = async (nick: string, des: string) => {
  await api.patch(
    `/user/info`,
    { nickname: nick, description: des }
  );
}

export const getUserInfo = async () => {
  const response = await api.get(
    `/user/me`
  );
  return response.data;
}

export const pushSubscribe = async (sub: PushSubscription) => {
  await api.post(
    `/push/subscribe`,
    {
      endpoint: sub.endpoint,
      keys: sub.toJSON().keys, // { p256dh, auth }
    }
  );
}

export const getNotification = async () => {
  const response = await api.get(`/notifications`);
  return response.data;
}

export const readNotification = async (id: number) => {
  await api.put(`/notifications/${id}`, null);
}

export const readAllNotification = async () => {
  await api.put(`/notifications`, null);
}

export const deleteNotification = async (id: number) => {
  await api.delete(
    `/notifications/${id}`
  );

}

export const postLogin = async (user: UserLogin) => {
  const response = await api.post(`/auth/login`, user, { skipAuthLogout: true });
  return response;
}

export const postRegister = async (user: UserRegister) => {
  await api.post(`/auth/register`, user);
}

export const fetchStudyList = async () => {
  const response = await api.get(`/study`);
  return response.data;
};

export const getAiRecommendation = async (title: string) => {
  const response = await api.get(`ai/recommend`, {
    params: { title }
  });
  return response.data;
}