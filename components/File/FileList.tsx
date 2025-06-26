import React, { useEffect, useState } from 'react'
import FileItem from './FileItem'
import { FileType } from '@/types/file'
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '@/Config/FirebaseConfig';

interface Props {
  fileList: FileType[];
  refetchFiles?: () => void;
}

function FileList({ fileList, refetchFiles  }: Props) {
    const [starredIds, setStarredIds] = useState<string[]>([]);
  const db = getFirestore(app)

    useEffect(() => {
    const fetchStarred = async () => {
      const snapshot = await getDocs(collection(db, 'starred'));
      const ids = snapshot.docs.map(doc => doc.id);
      setStarredIds(ids);
    };
    fetchStarred();
  }, []);

  return (
    <div className="bg-white mt-5 p-5 rounded-lg w-full ">
  <h2 className="font-semibold text-sm sm:text-base">My Files</h2>
<div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b py-2 mt-4">
  <div className="col-span-6 sm:col-span-4">Name</div>
  <div className="hidden sm:block sm:col-span-3">Last Modified</div>
  <div className="hidden sm:block sm:col-span-2">Owner</div>
  <div className="hidden sm:block sm:col-span-1">Size</div>
  <div className="col-span-3 sm:col-span-1">Starred</div>
  <div className="col-span-3 sm:col-span-1 text-right"></div>
</div>



  {/* File Items */}
  {fileList && fileList.map((item, index) => (
    <FileItem key={index} file={item} isStarred={starredIds.includes(String(item.id))}
            refetchFiles={refetchFiles}/>
  ))}
</div>

  )
}

export default FileList
