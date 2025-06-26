import menu from '@/data/menu'
import Image from 'next/image'
import React, { useState } from 'react'
import CreateFolderModal from './Folder/CreateFolderModal';
import UploadFileModal from './File/UploadFileModal';

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function SideNavbar() {
    const [activeIndex, setActiveIndex] = useState(0);
    const router=useRouter();
    const {data:session}=useSession();

    const onMenuClick=(_: any,index: number, route: string)=>{
        setActiveIndex(index);
        router.push(`/${route}`)
    }

  return session && (
    <div className='w-[200px]
    bg-[#F6F6F6] h-screen sticky top-0
    z-10 border-r border-black/[0.08] p-5'>
        <div className='flex'>
            <Image src='/logo.svg'
                alt='logo'
                width={120}
                height={60}
                onClick={()=>router.push('/')}
            />
        </div>

        <div className="dropdown dropdown-bottom w-full mb-8">
          <label 
          tabIndex={0} 
          className="btn border-0 hover:border-0 bg-white hover:bg-white 
                 gap-2 px-4 py-8 rounded-[12px]
                 shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]
                 hover:shadow-[0_16px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]
                 transition-all duration-300 w-fit
                 text-base font-normal"
          >
            New
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </label>
          
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-full mt-2">
            <li>
              <a className="flex gap-2" onClick={()=>{
            const modal = document.getElementById('upload_file') as HTMLDialogElement | null;
            modal?.showModal();
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload File
              </a>
            </li>
            <li>
              <a className="flex gap-2" onClick={()=>{
            const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null;
            modal?.showModal();
            }}>
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                New Folder
              </a>
            </li>
          </ul>
        </div>

        <div>
            {menu.list.map((item, index)=>(
                    <h2 key={item.id} onClick={()=>onMenuClick(item, index, item.route)} className={`group flex gap-2 items-center
                    p-2 mt-3 text-[#5B5B5B] text-sm
                    transition-all duration-200 cursor-pointer w-full
                hover:bg-[#497FFF1A] hover:text-[#497FFF] hover:rounded-[8px]
                ${activeIndex == index ? 'bg-[#497FFF1A] text-blue-500 rounded-[8px]' : null}
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  strokeWidth={1.5} stroke="rgba(0,0,0,0.4)" className={`h-5 w-5 transition-colors duration-200 group-hover:stroke-[#497FFF] ${activeIndex == index ? "stroke-[#497FFF]": null}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.logo} strokeWidth={1.5}/>
                    </svg>
                    {item.name}
                    </h2>
            ))}
        </div>

        <dialog id="my_modal_3" className="modal">
            <CreateFolderModal/>
        </dialog>
        <dialog id="upload_file" className="modal">
            <UploadFileModal 
            closeModal={()=>{
            const modal = document.getElementById('upload_file') as HTMLDialogElement | null;
            modal?.close();
            }}/>
        </dialog>
    </div>
  )
}

export default SideNavbar