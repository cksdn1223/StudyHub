import { z } from "zod";

export const studySchema = z.object({
  title: z.string().min(1, "스터디 제목을 입력해주세요."),
  description: z.string().min(1, "스터디 설명을 입력해주세요."),

  memberCount: z.number().min(1),
  maxMembers: z.number().min(1),

  frequency: z.string().min(1, "진행 빈도를 선택해주세요."),
  duration: z.string().min(1, "예상 기간을 선택해주세요."),
  detailLocation: z.string().min(1, "진행 방식을 선택해주세요."),

  tags: z.array(z.string()).min(1, "기술 스택 태그를 1개 이상 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  detailAddress: z.string().optional(),

  longitude: z.number(),
  latitude: z.number(),
});

export type StudyFormValues = z.infer<typeof studySchema>;