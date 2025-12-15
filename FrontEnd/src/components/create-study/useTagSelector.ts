import { useCallback, useMemo, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { StudyFormValues } from "./studySchema";

export function useTagSelector(
  tagList: string[],
  showToast: (msg: string, type: "error" | "info" | "success") => void,
  watch: UseFormWatch<StudyFormValues>,
  setValue: UseFormSetValue<StudyFormValues>
) {
  const [tag, setTag] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const EMPTY_ARRAY: string[] = [];
  const tags = watch("tags") ?? EMPTY_ARRAY;

  const addTag = useCallback(
    (inputTag: string) => {
      const t = inputTag.trim();
      if (!t) return showToast("빈 태그는 입력하실 수 없습니다.", "error");
      if (tags.includes(t)) return showToast("중복된 태그는 입력하실 수 없습니다.", "info");

      setValue("tags", [...tags, t], { shouldValidate: true, shouldDirty: true });
      setTag("");
    },
    [tags, setValue, showToast]
  );

  const removeTag = useCallback(
    (t: string) => {
      setValue("tags", tags.filter((x) => x !== t), { shouldValidate: true, shouldDirty: true });
    },
    [tags, setValue]
  );

  const filteredTags = useMemo(() => {
    if (tag.length < 1) return [];
    return tagList
      .filter((item) => item.toLowerCase().includes(tag.toLowerCase()) && !tags.includes(item))
      .slice(0, 5);
  }, [tag, tagList, tags]);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setTimeout(() => setIsFocused(false), 150), []);

  return {
    tag,
    setTag,
    tags,
    isFocused,
    onFocus,
    onBlur,
    filteredTags,
    addTag,
    removeTag,
  };
}