"use client"

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from '../actions';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

// push通知に必要な公開鍵(public Key)をBase64形式からUnit8Arrayに変換する処理
function urlBase64ToUnit8Array(base64String: string) {
  // base64の文字列が4の倍数になるように、repeat()で不足分を'='の記号で追加する。
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  // 受け取ったbase64の値とpadding(=)を結合して、-の値を'+'に、'_'を'/'に変換
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  // window.atob()で文字列を元のバイナリデータに変換する。
  const rawData = window.atob(base64)

  // Unit8Arrayで8ビットの符号なし整数の配列に変換。
  const outputArray = new Uint8Array(rawData.length)

  // 配列の値をoutputArrayにrawDataの文字列を格納。
  for ( let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// push通知の設定(subscribe)
function usePushNotificationManager() {
  // push通知が対象のブラウザでサポートされているかを管理する状態変数
  const [isSupported, setIsSupported] = useState(false); 
  // push通知がsubscribeされているかを管理する状態変数。
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // push通知のmessageを管理する状態変数
  const [message, setMessage] = useState('');

  // コンポーネントのマウント時にserviceWorkerやPushManagerが含まれていればpush通知のサポート対象。
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // サポート対象の場合はisSupportedをtrueにし、ServiceWorkerの登録を行う。
      setIsSupported(true)
      registerServiceWorker()
    }
  }, []);

  // サービスワーカーの登録設定
  async function registerServiceWorker() {
    // navigator.serviceWorker.register('実行したいjsファイル')でWorkerを登録
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })

    // pushManager.getSubscription() で、既存のプッシュ通知の購読情報を取得。
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub)
  }

  // push設定のsubscribe設定
  async function subscribeToPush() {
    // Service Workerの登録完了し、activeになるのを待つ
    const registration = await navigator.serviceWorker.ready
    // registration.pushManager.subscribe()でpush通知のsubscribeを開始する。
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUnit8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)

    // 購読情報をJSON形式に変換し、subscribeUser関数を実行する
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }

  // push通知を解除する
  async function unsubscribeFromPush() {
    // subscriptionが存在したら場合に、unsubscribe()メソッドを実行して解除する
    await subscription?.unsubscribe()
    setSubscription(null)

    // subscribeを解除したユーザーを登録するunsubscribeUser()関数を実行する
    await unsubscribeUser()
  }

  // テスト用messageを送る関数。
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }

  return {
    isSupported,
    subscription,
    message,
    setMessage,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
  };
}

const Home = () => {
  const  {
    isSupported,
    subscription,
    message,
    setMessage,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
  } = usePushNotificationManager();
  
  if (!isSupported) {
    return <p>Push notification are not supported in this browser.</p>
  }
  
  return(
    <div className="p-10">
      <h1 className="font-bold text-center text-lg">
        Homeページ
      </h1>

      <div>
        <h3 className="text-lg font-bold mb-6">通知設定</h3>
        {subscription ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p>プッシュ通知の設定：ON</p>
              <Button variant="outlined" onClick={unsubscribeFromPush}>通知の解除</Button>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text"
                placeholder="通知設定の内容を記入"
                value={message}
                className='p-2 border border-gray-200'
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="outlined" onClick={sendTestNotification}>Send Test</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>プッシュ通知の設定：OFF</p>
            <Button variant="outlined" onClick={subscribeToPush}>通知ON</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;