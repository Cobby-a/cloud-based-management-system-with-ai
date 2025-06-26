import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import Image from 'next/image';
import { FileType } from '@/types/file';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon, InformationCircleIcon, ShareIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { updateDoc, doc, getFirestore, setDoc, deleteDoc } from 'firebase/firestore';
import app from '@/Config/FirebaseConfig';
import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import ShareModal from '../ShareModel';
import toast from 'react-hot-toast';

interface Props {
  file: FileType;
    isStarred?: boolean;
  refetchFiles?: () => void;
}

function FileItem({ file, isStarred, refetchFiles  }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [starred, setStarred] = useState(isStarred);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
  if (!file.imageUrl) {
    console.error("File URL is missing");
    return;
  }
  setShowShareModal(true);
};

  const { data: session } = useSession();
    if (!session) return null;

    useEffect(() => {
    setStarred(isStarred);
  }, [isStarred]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  

  const fileTypeExists = (type: string): boolean => {
  try {
    require(`../../public/${type}.svg`);
    return true;
  } catch {
    return false;
  }
};
  const db = getFirestore(app)

const handleRename = async () => {
    const [baseName, ext] = file.name.split(/\.(?=[^\.]+$)/); // split into name and extension
    const newBaseName = prompt("Enter new file name:", baseName);
    if (!newBaseName || newBaseName === baseName) return;

    const newName = `${newBaseName}.${ext}`;

    try {
      const fileRef = doc(db, "files", String(file.id));
      await updateDoc(fileRef, { name: newName, updatedAt: new Date().toISOString() });
      refetchFiles?.();
      window.location.reload();
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  const moveToTrash = async () => {
    try {
      const fileRef = doc(db, "files", String(file.id));
      const trashRef = doc(db, "trash", String(file.id));
      const starredRef = doc(db, "starred", String(file.id));

      const updatedFile = {
        ...file,
        updatedAt: new Date().toISOString()
      };

      await setDoc(trashRef, updatedFile);
      await deleteDoc(fileRef);
      await deleteDoc(starredRef);
      refetchFiles?.();
      window.location.reload();
    } catch (error) {
      console.error("Error moving file to trash:", error);
    }
  };


const downloadFile = async () => {
  try {
    if (!file.imageUrl || !file.name) {
      console.error("Missing file URL or name");
      return; // or handle error appropriately
    }
    const apiUrl = `/api/download?filePath=${encodeURIComponent(file.imageUrl)}&fileName=${encodeURIComponent(file.name)}`;

    const a = document.createElement("a");
    a.href = apiUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

 if (!session) return null;
 
const toggleStarred = async () => {
    const starRef = doc(db, 'starred', file.id.toString());
    if (starred) {
      await deleteDoc(starRef);
    } else {
      // await setDoc(starRef, { ...file });
      await setDoc(starRef, { ...file, fileId: file.id });
    }
    setStarred(!starred);
  };

  return (
    <div className="grid grid-cols-12 items-center py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
  {/* File Name */}
  <div className="col-span-6 sm:col-span-4 flex items-center gap-2 truncate">
    <Image src={`/${fileTypeExists(file.type) ? file.type : 'other'}.svg`}  alt="file" width={20} height={20} />
    <span className="truncate">{file.name}</span>
  </div>

  {/* Last Modified */}
  <div className="hidden sm:block sm:col-span-3 truncate">
    {moment(file.modifiedAt).format("MMM D, YYYY")}
  </div>

  {/* Owner */}
  <div className="hidden sm:block sm:col-span-2 truncate">
    {file.createdBy === session.user.email ? "Me" : file.createdBy}
  </div>

  {/* Size */}
  <div className="hidden sm:block sm:col-span-1 truncate">
    {(file.size / 1024 ** 2).toFixed(2)} MB
  </div>

{/* Starred */}
      <div className="col-span-3 sm:col-span-1 flex justify-center">
        <button onClick={toggleStarred}>
          {starred ? (
            <StarIconFilled className="w-5 h-5 text-yellow-500" />
          ) : (
            <StarIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
      
  {/* Actions */}
  <div className="col-span-3 sm:col-span-1 flex justify-end relative" ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li>
                <button onClick={handleRename} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Rename
                </button>
              </li>
              <li>
                <button onClick={moveToTrash} className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Delete
                </button>
              </li>
              <li>
                <button onClick={downloadFile} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download
                </button>
              </li>
              <li>
                <button onClick={handleShare} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Share
                </button>
              </li>
              <li>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  File Info
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* {showShareModal && (
      <ShareModal
        fileUrl={file.imageUrl}
        fileName={file.name}
        onClose={() => setShowShareModal(false)}
      />
      )} */}
{showShareModal && file.imageUrl && (
  <ShareModal
    fileUrl={file.imageUrl as string}
    fileName={file.name}
    onClose={() => setShowShareModal(false)}
  />
)}

    </div>
  );
}

export default FileItem;
