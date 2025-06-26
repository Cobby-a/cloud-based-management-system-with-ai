"use client"

import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";
import Folderlist from "@/components/Folder/Folderlist";
import FileList from "@/components/File/FileList";
import { collection, getDocs, getFirestore, query, where, orderBy, limit } from 'firebase/firestore';
import app from "@/Config/FirebaseConfig";
import { ParentFolderIdContext } from "@/context/ParentFolderIdContext";
import { ShowToastContext } from "@/context/ShowToastContext";
import { FolderType } from "@/types/folder";
import { FileType } from "@/types/file";

export default function MySpace() {
  const { data: session, status } = useSession();
  const router=useRouter();

  const [folderList,setFolderList]=useState<FolderType[]>([])
  const [fileList,setFileList]=useState<FileType[]>([])

  const db = getFirestore(app)


  const parentCtx = useContext(ParentFolderIdContext);
  const toastCtx = useContext(ShowToastContext);
    
    useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    parentCtx?.setParentFolderId?.("0");
    setFolderList([]);
    setFileList([]);

    getFolderList();
    getFileList();
  }, [session, status, toastCtx?.showToastMsg]);

    async function getFolderList(){
        if (!session?.user?.email) return;

        const q = query(
          collection(db,"Folders"),
          where("parentFolderId",'==',"0"),
          where("createdBy",'==',session.user.email),
          // orderBy("createdAt", "desc"),
          // limit(8)
      );
        
        const querySnapshot = await getDocs(q);

        const folders: FolderType[] = [];

        querySnapshot.forEach((docSnap) => {
          folders.push({ ...(docSnap.data() as FolderType), id: Number(docSnap.id) });
      });

      setFolderList(folders)
    }

    async function getFileList(){

      if (!session?.user?.email) return;


      const q = query(
        collection(db,"files"),
        where("parentFolderId",'==',"0"),
        where("createdBy",'==',session.user.email),
        // orderBy("createdAt", "desc"),
        // limit(8)
      );
    
      const querySnapshot = await getDocs(q);
      const files: FileType[] = [];

        querySnapshot.forEach((docSnap) => {
      
        files.push({ ...(docSnap.data() as FileType), id: Number((docSnap.id)) }); 
      }); 

      setFileList(files)
    }
    
    if (status === "loading") return null;
  if (!session) return null;
  return (
    <div>
      <SearchBar/>
      <Folderlist folderList={folderList}/>
      <FileList fileList={fileList}/>
    </div>
  );
}
