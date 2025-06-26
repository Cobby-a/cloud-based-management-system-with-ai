import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import app from '@/Config/FirebaseConfig'
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { ShowToastContext } from '@/context/ShowToastContext';
import { ParentFolderIdContext } from '@/context/ParentFolderIdContext';

function CreateFolderModal() {
    const docId=Date.now().toString();
    const [folderName,setFolderName]=useState<string>('');
    
    const toastCtx = useContext(ShowToastContext)
    const parentFolderCtx = useContext(ParentFolderIdContext);
    const {data:session}=useSession();

    if (!toastCtx || !parentFolderCtx || !session || !session.user?.email)
    return null;

    const {setShowToastMsg}=toastCtx
    
    const { parentFolderId } = parentFolderCtx;

    const db = getFirestore(app);
    
    const onCreate=async()=>{
        if (!folderName.trim()) {
            setShowToastMsg("Folder name cannot be empty");
            return;
        }
        
        await setDoc(doc(db,"Folders",docId),{
            name:folderName,
            id:docId,
            createdBy:session.user.email,
            parentFolderId:parentFolderId,
            createdAt: new Date().toISOString(),
            updatedAt: null,
        })
        setShowToastMsg('Folder Created!');
        setFolderName("");
    }
  return (
    <div>
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <div className="w-full items-center 
                            flex flex-col justify-center gap-3">
                            <Image src="/folder.svg" alt="folder" width={50} height={50} />
                            <input
                                type="text"
                                placeholder="Folder Name"
                                className="p-2 border-[1px] outline-none
                                    rounded-md"
                                    onChange={(e)=>setFolderName(e.target.value)}
                        />
                            <button className="bg-blue-500
                            text-white rounded-md p-2 px-3 w-full"
                          onClick={()=>onCreate()}
                            >Create</button>
                        </div>
                </form>
            </div>
    </div>
  )
}

export default CreateFolderModal