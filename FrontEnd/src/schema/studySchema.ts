import { z } from "zod";

export const studySchema = z.object({
  // 제목: 1자 이상 50자 이하
  title: z
    .string()
    .trim()
    .min(1, "스터디 제목을 입력해주세요.")
    .max(50, "제목은 최대 50자 이내로 작성해주세요."),

  // 설명: 1자 이상 1000자 이하
  description: z
    .string()
    .trim()
    .min(1, "스터디 설명을 입력해주세요.")
    .max(1500, "설명은 최대 1500자 이내로 작성해주세요."),

  // 인원수: 최소 2명 ~ 최대 100명 (예시)
  maxMembers: z
    .number()
    .min(2, "최소 2명 이상이어야 합니다.")
    .max(100, "최대 100명까지 가능합니다."),

  frequency: z.string().min(1, "진행 빈도를 선택해주세요."),
  duration: z.string().min(1, "예상 기간을 선택해주세요."),
  detailLocation: z.string().min(1, "진행 방식을 선택해주세요."),

  // 태그: 최소 1개 ~ 최대 10개 (너무 많으면 UI 깨짐 방지)
  tags: z
    .array(z.string())
    .min(1, "기술 스택 태그를 1개 이상 입력해주세요.")
    .max(10, "태그는 최대 10개까지만 선택 가능합니다."),

  address: z.string().min(1, "주소를 입력해주세요."),
  detailAddress: z.string().optional(),

  longitude: z.number(),
  latitude: z.number(),
});

export type StudyFormValues = z.infer<typeof studySchema>;