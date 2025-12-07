
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerPush = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("푸시 알림을 지원하지 않는 브라우저입니다.");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }

  // service worker 등록
  const registration = await navigator.serviceWorker.register("/sw.js");

  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  return subscription;
};
