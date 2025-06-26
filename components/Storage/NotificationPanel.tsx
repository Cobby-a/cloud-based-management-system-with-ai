'use client';
import { useEffect, useState } from 'react';
import app from '@/Config/FirebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc,getFirestore } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  message: string;
  fileId: string;
  createdAt: string;
  read: boolean;
}

const NotificationPanel = () => {
const db = getFirestore(app)
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session?.user.email) return;

    const fetchNotifications = async () => {
      const q = query(collection(db, 'notifications'), where('to', '==', session.user.email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(data);
    };

    fetchNotifications();
  }, [session?.user.email]);

  const clearNotifications = async () => {
    const deletePromises = notifications.map(notification => deleteDoc(doc(db, 'notifications', notification.id)));
    await Promise.all(deletePromises);
    setNotifications([]);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-md z-50 text-sm overflow-hidden">
      <div className="p-4 font-semibold border-b">Notifications</div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications</p>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="p-4 border-b">
              {notif.message}
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <button
          onClick={clearNotifications}
          className="w-full text-center text-blue-600 py-2 hover:bg-gray-100 transition"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default NotificationPanel;
