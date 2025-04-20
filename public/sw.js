
// server workerがpush通知を受信した時に実行される処理。'push'という名前でイベント名を定義。
self.addEventListener('push', function (event) {
  // push通知と同時にデータが送信されているかを確認し、存在していればJSON形式で保存。
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      // icon: data.icon || '/icon.png',
      // badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),  // 通知が到着した日付を取得
        primaryKey: '2',            // primaryKeyを取得し、通知がクリックされた時に使用する。
      },
    }
    // 通知を実際に表示させる処理
    // event.waitUntil(self.registration.showNotification(data.title, options))
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
})

// push通知がクリックされた時の処理
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  // push通知がクリックされた時に遷移する先のページを指定
  // event.waitUntil(clients.openWindow('https://notification-app-alpha.vercel.app/home'))
  event.waitUntil(clients.openWindow('https://localhost:3000/home'))
})