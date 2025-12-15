import { useForm } from "react-hook-form";
import { studySchema, StudyFormValues } from "../schema/studySchema";
import { defaultValues } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";

export function useStudyForm() {
  const form = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues,
    mode: "onSubmit",          // 제출 때만 검증(원하면 onChange)
    reValidateMode: "onChange", // 제출 후 수정하면 재검증
  });

  return form;
}
