'use server'

import webpush, { PushSubscription }  from 'web-push'

// webpushパッケージの詳細設定
webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  return { success: true}
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true}
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  // webpush.sendNotification()関数を実行してpush通知を送る
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
      })
    )
    return { success: true}
  } catch (error) {
    console.error('Error sending push notification', error)
    return { success: false, error: 'Failed to send notification'}
  }
}
