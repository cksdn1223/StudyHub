export const queryKeys = {
  myStudyList: () => ["myStudyList"] as const,
  chatList: (studyId: number | null) => ["chatList", studyId] as const,
  notifications: () => ["notifications"] as const,
};
