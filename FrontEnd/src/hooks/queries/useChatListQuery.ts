import { useQuery } from "@tanstack/react-query";
import type { ChatMessage } from "../../type";
import { getChatData } from "../../api/api";
import { queryKeys } from "../../utils/keys";

export function useChatListQuery(studyId: number | null) {
  return useQuery<ChatMessage[]>({
    queryKey: queryKeys.chatList(studyId),
    queryFn: () => getChatData(studyId as number),
    enabled: !!studyId,
  });
}
