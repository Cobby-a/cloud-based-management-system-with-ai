import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import FileList from '../../components/File/FileList';
import SearchBar from '@/components/SearchBar';
import app from '@/Config/FirebaseConfig';
import Folderlist from '@/components/Folder/Folderlist';
import { ShowToastContext } from '@/context/ShowToastContext';
import { ParentFolderIdContext } from '@/context/ParentFolderIdContext';
import { FileType } from '@/types/file';
import { FolderType } from '@/types/folder';


function FolderDetails() {
    const router=useRouter();
    const {name,id}=router.query;

    const {data:session}=useSession();


    const parentCtx = useContext(ParentFolderIdContext);
    const toastCtx = useContext(ShowToastContext);
    
    const [folderList, setFolderList] = useState<FolderType[]>([]);
    const [fileList, setFileList] = useState<FileType[]>([]);
     const db=getFirestore(app)

    useEffect(() => {
        if (
        !session?.user?.email ||
        typeof id !== 'string' ||
        !parentCtx?.setParentFolderId
        )
        return;

        parentCtx.setParentFolderId(id);
        setFolderList([]);
        setFileList([]);
        getFolderList();
        getFileList();
    }, [id, session, toastCtx?.showToastMsg]);

    const deleteFolder=async()=>{
        if (typeof id !== 'string' || !toastCtx?.setShowToastMsg) return;
        await deleteDoc(doc(db, "Folders", id)).then(resp=>{
            toastCtx.setShowToastMsg('Folder Deleted!');
            router.back();
        })
        
    }

     const getFolderList=async()=>{
        if (!session?.user?.email || typeof id !== 'string') return;

        const q = query(
        collection(db,"Folders"),
        where("createdBy",'==',session.user.email),
        where("parentFolderId","==",id)
    );
        const querySnapshot = await getDocs(q);
        const folders: FolderType[] = [];
        querySnapshot.forEach((docSnap) => {
        folders.push({ ...(docSnap.data() as FolderType), id: Number(docSnap.id) });
    });
        setFolderList(folders);
    }

      const getFileList=async()=>{
        if (!session?.user?.email || typeof id !== 'string') return;

        const q = query(
            collection(db,"files"),
            where("parentFolderId",'==',id),
            where("createdBy",'==',session.user.email)
        );
        const querySnapshot = await getDocs(q);
        const files: FileType[] = [];
        querySnapshot.forEach((docSnap) => {
        files.push({ ...(docSnap.data() as FileType), id: Number(docSnap.id) });
    });
    setFileList(files);
      }
  return (  
    <div className='p-5'>
        <SearchBar/>
        <h2 className='text-[20px] font-bold mt-5'>{name}
        <svg xmlns="http://www.w3.org/2000/svg" 
        onClick={()=>deleteFolder()}
          fill="none" viewBox="0 0 24 24" 
          strokeWidth={1.5} stroke="currentColor"
           className="w-5 h-5 float-right text-red-500
           hover:scale-110 transition-all cursor-pointer">
       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        </h2>
   
       {folderList.length>0? (
        <Folderlist 
            folderList={folderList} isBig={false}/>
       ):(
        <h2 className='text-gray-400
        text-[16px] mt-5'>No Folder Found</h2>)}
        
        <FileList fileList={fileList} />
    </div>
  )
}

export default FolderDetails