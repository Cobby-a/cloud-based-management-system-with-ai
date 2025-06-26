'use-client'

import { Poppins } from 'next/font/google';
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import SideNavbar from '@/components/SideNavbar';
import Toast from '@/components/Toast';
import { ShowToastContext } from '@/context/ShowToastContext';
import { useState, useEffect } from 'react';
import { ParentFolderIdContext } from '@/context/ParentFolderIdContext';
import Storage from '@/components/Storage/Storage';
import { usePathname } from 'next/navigation';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}
: AppProps<{
  session: Session | null;
}>) 
{
  const[showToastMsg, setShowToastMsg] = useState<string | null>(null);
  const [parentFolderId,setParentFolderId]=useState<string | null>(null);

  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthPage = pathname === '/login';

  if (!isClient) return null;

  return (
    <SessionProvider session={session}>
      <ParentFolderIdContext.Provider value={{parentFolderId,setParentFolderId}}>
      <ShowToastContext.Provider value={{showToastMsg, setShowToastMsg}}>
      <main className={`flex ${poppins.className}`}>
        {!isAuthPage && (
          <>
          <SideNavbar/>
          <div className='grid grid-cols-1
          md:grid-cols-3 w-full'>
            <div className='col-span-2'>
              <Component {...pageProps} />
            </div>
            <div className='bg-white p-5 order-first md:order-last'>
              <Storage/>
            </div>
          </div>
          </>
          )}
          {isAuthPage && <Component {...pageProps} />}
      </main>
      {showToastMsg && <Toast msg={showToastMsg}/>}
      </ShowToastContext.Provider>
      </ParentFolderIdContext.Provider>
    </SessionProvider>
  );
}