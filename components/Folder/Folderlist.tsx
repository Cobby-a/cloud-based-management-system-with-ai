import React, { useState } from 'react'
import FolderItem from './FolderItem'
import { useRouter } from "next/router";
import FolderItemSmall from './FolderItemSmall';
import { FolderType } from '@/types/folder';


interface FolderListProps {
  folderList: FolderType[];
  isBig?: boolean;
}

function Folderlist({folderList, isBig=true}: FolderListProps) {
    const [activeFolder, setActiveFolder] = useState<number | null>(null);
    const router = useRouter();

const onFolderClick = (index: number, item:FolderType) => {
    setActiveFolder(index);
    router.push({
      pathname: "/folder/" + item.id,
      // pathname: "/folder/" + item.id,
      query: {
        name: item.name,
        id: item.id,
      },
    });
  };
  return (
    <div className="p-5 bg-white w-full max-w-[100vw]">

        {isBig ?
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm sm:text-base">Recent Folders</h2>
        <span className="text-blue-400 font-regular text-xs sm:text-sm cursor-pointer">
          View All
        </span>
      </div>
: null}
        {isBig ?

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          width: '100%',
        }}
      >
        {folderList.map((item, index) => (
        <div onClick={()=>onFolderClick(index, item)} key={index}>

            <FolderItem 
            folder={item} 
            activeFolder={activeFolder==index}
            />
        </div>
        ))}
      </div>
: 
<div
      className=" 
      "
    >
      {folderList.map((item, index) => (
        <div key={index} onClick={() => onFolderClick(index, item)}>
      <FolderItemSmall folder={item} />
        
        </div>
      ))}
    </div>
}
      
    </div>
  )
}

export default Folderlist