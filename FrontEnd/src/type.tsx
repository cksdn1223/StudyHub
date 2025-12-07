// 이메일 조건 예시: 기본 이메일 형식 검증
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 비밀번호 조건 예시: 최소 8자, 영문/숫자/특수문자 포함 + 공백 허용 안 함 (?!.*\s)
export const PASSWORD_REGEX = /^(?!.*\s)(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export type UserLogin = {
  email: string;
  password: string;
}

export type UserRegister = {
  nickname: string;
  email: string;
  password: string;
  address: string;
  longitude: number;
  latitude: number;
}

export type axiosErrorType = {
  response:
  {
    data:
    {
      status: number;
      message: string;
    }
  }
}

export type StudyData = {
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  frequency: string;
  duration: string;
  tags: string[];
  address: string;
  longitude: number;
  latitude: number;
  detailAddress: string;
  detailLocation: string;
}

export type StudyList = {
  id: number;
  leaderId: number;
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  frequency: string;
  duration: string;
  tags: string[];
  distanceKm: number;
  status: string;
  createdAt: string;
  detailLocation: string;
  address: string;
  detailAddress: string;
  formattedCreatedAt: string;
}

export type Member = {
  email: string;
  leader: boolean;
  nickname: string;
  status: string | null;
  userId: number;
  profileImageUrl?: string;
}

export type MyStudyList = {
  address: string;
  description: string;
  detailAddress: string;
  detailLocation: string;
  duration: string;
  frequency: string;
  maxMembers: string;
  memberCount: number;
  members: Member[];
  status: string;
  studyId: number;
  title: string;
}

export type UserInfo = {
  nickname: string;
  email: string;
  role: string;
  description: string;
  address: string;
  profileImageUrl: string;
}

export type ChatMessage = {
  senderId: number;
  senderNickname: string;
  content: string;
  sentAt: string;
}

export type Notification = {
  id: number,
  message: string,
  isRead: boolean,
  type: "JOIN_REQUEST" | "REQUEST_ACCEPTED" | "REQUEST_REJECTED" | "MESSAGE" | "BAN",
  studyId: number,
  studyTitle: string,
  senderId: number,
  senderNickname: string,
  createdAt: string
}

export type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: number) => void | Promise<void>
};

export type ParticipantStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "BAN"


export type ParticipantRequest = {
  userId: number,
  status: ParticipantStatus
}

export type User = {
  id: number;
  email: string;
  nickname: string;
  address: string;
  description: string;
  role: string;
  profileImageUrl: string;
}

export type JwtPayload = {
  exp: number;
  userId: number;
  role: string;
};