import { useQuery } from "@tanstack/react-query";
import { getData } from "../../api/api";
import { MyStudyList } from "../../type";
import { queryKeys } from "../../utils/keys";

export function useMyStudyListQuery(enabled: boolean) {
  return useQuery<MyStudyList[]>({
    queryKey: queryKeys.myStudyList(),
    queryFn: getData,
    enabled,
  });
}
