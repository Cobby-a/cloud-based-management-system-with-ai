// components/ShareModal.tsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
  ownerName: string;
  ownerImage: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileUrl,
  ownerName,
  ownerImage,
}) => {
  const copyLink = () => {
    navigator.clipboard.writeText(fileUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-5 rounded-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">Share File</Dialog.Title>
          <div className="flex items-center gap-3 mb-4">
            <Image src={ownerImage} alt="owner" width={30} height={30} className="rounded-full" />
            <span className="text-sm font-medium">{ownerName}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">File: {fileName}</p>
          <input
            type="text"
            readOnly
            value={fileUrl}
            className="w-full px-3 py-2 border rounded mb-4 text-sm"
          />
          <button
            onClick={copyLink}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm mb-2"
          >
            Copy Link
          </button>
          <button
            onClick={onClose}
            className="w-full border text-sm py-2 rounded"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareModal;