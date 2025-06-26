import Image from 'next/image'
import React from 'react'

interface FolderProps {
  folder: {
    id: number
    name: string
    createdBy?: string;
    parentFolderId?: string;
  }
    activeFolder: boolean;
}

function FolderItem({folder}: FolderProps) {
  return (
    <div
      className="w-full p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-md"
      style={{ backgroundColor: 'rgba(73, 127, 255, 0.05)', borderRadius: '8px' }}
    >
      <Image
      src='/folder.svg'
        alt='folder'
        width={50}
        height={37}
        // style={{ display: 'block' }}
      />
      <h2 className='mt-3 text-center text-[13px] font-[400] text-[#555555]'
      >
        {folder.name}
      </h2>
    </div>
  )
}

export default FolderItem