import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/keys";
import { getNotification } from "../../api/api";
import { Notification } from "../../type";

export function useNotificationsQuery(enabled: boolean) {
  return useQuery<Notification[]>({
    queryKey: queryKeys.notifications(),
    queryFn: async () => {
      const list = await getNotification();
      return [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}