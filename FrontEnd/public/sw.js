
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "StudyHub 알림", message: event.data.text() };
  }

  const title = data.title || "StudyHub 알림";
  const options = {
    body: data.message || "",
    icon: "/vite.svg",  // 있으면 쓰고, 없으면 생략해도 됨
    badge: "/vite.svg", // 선택
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 시 특정 페이지로 이동
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // 이미 열린 탭 있으면 그걸 포커스
      for (const client of clientList) {
        if ("focus" in client) {
          if (client.url.includes(url)) {
            return client.focus();
          }
        }
      }
      // 없으면 새 탭 열기
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
