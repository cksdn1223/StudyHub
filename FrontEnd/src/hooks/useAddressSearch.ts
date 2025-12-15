import { useState, useCallback } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { UseFormSetValue } from "react-hook-form";
import { StudyFormValues } from "../schema/studySchema";
import { getLocation } from "../api/api";

export function useAddressSearch(setValue: UseFormSetValue<StudyFormValues>) {
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const open = useDaumPostcodePopup(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const handleComplete = useCallback(async (data: { address: string }) => {
    try {
      setIsAddressLoading(true);
      const location = await getLocation(data);

      setValue("address", data.address, { shouldValidate: true });
      setValue("latitude", location.lat, { shouldValidate: true });
      setValue("longitude", location.lng, { shouldValidate: true });
    } finally {
      setIsAddressLoading(false);
    }
  }, [setValue]);

  const openAddress = useCallback(() => {
    open({ onComplete: handleComplete });
  }, [open, handleComplete]);

  return { isAddressLoading, openAddress };
}
