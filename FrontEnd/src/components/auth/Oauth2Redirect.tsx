import { useEffect, useRef } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect() {
  const { showToast } = useToast();
  const { login, user } = useAuth();
  const ranRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const hash = new URLSearchParams(window.location.hash.replace("#", ""));
    const token = hash.get("token");

    if (!token) {
      showToast("소셜 로그인 토큰을 받지 못했습니다.", "error");
      window.location.replace("/auth/login");
      return;
    }

    const studyHubToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    
    (async () => {
      try {
        await login(studyHubToken);
        showToast("로그인에 성공했습니다.", "success");
        navigate("/");
      } catch (e) {
        showToast("로그인 처리 중 오류가 발생했습니다.", "error");
        navigate("/auth/login");
      }
    })();
    // (async)(즉시호출);
  }, [login, navigate, showToast, user]);

  return <div className="p-6">로그인 처리 중...</div>;
}
