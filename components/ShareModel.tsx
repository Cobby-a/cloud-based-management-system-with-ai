'use client';
import React, { useState } from 'react';
import { doc, setDoc, collection, getFirestore } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import app from '@/Config/FirebaseConfig';
import toast from 'react-hot-toast';

// interface ShareModalProps {
//   fileUrl: string;
//   fileName: string;
//   onClose: () => void;
// }
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileData: any; // file metadata
}

// export default function ShareModal({ fileUrl, fileName, onClose }: ShareModalProps) {
export default function ShareModal({ isOpen, onClose, fileData }: ShareModalProps) {

const db = getFirestore(app)
//   const [copySuccess, setCopySuccess] = useState(false);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(fileUrl);
//     setCopySuccess(true);
//     setTimeout(() => setCopySuccess(false), 1500);
//   };
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSend = async () => {
    if (!email || !fileData || !session) return;
    setLoading(true);
    try {
      const sharedData = {
        ...fileData,
        shared_with: email,
        shared_by: session.user.email,
        shared_at: new Date().toISOString(),
      };

      const sharedRef = doc(collection(db, 'shared'));
      await setDoc(sharedRef, sharedData);

      const notification = {
        to: email,
        message: `${session.user.name} has shared "${fileData.name}" with you. Check it out!`,
        fileId: fileData.id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const notificationRef = doc(collection(db, 'notifications'));
      await setDoc(notificationRef, notification);

      toast.success('File shared successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to share file');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //   <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
    //     <h2 className="text-lg font-semibold mb-4">Share "{fileName}"</h2>
    //     <div className="flex items-center justify-between border px-3 py-2 rounded mb-4">
    //       <span className="truncate">{fileUrl}</span>
    //       <button
    //         onClick={copyToClipboard}
    //         className="text-blue-600 font-medium ml-4"
    //       >
    //         {copySuccess ? "Copied!" : "Copy Link"}
    //       </button>
    //     </div>
    //     <div className="flex justify-end">
    //       <button
    //         onClick={onClose}
    //         className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
    //       >
    //         Close
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-lg font-semibold">Share File</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient's email"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
