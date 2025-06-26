import { collection, getDocs, getFirestore, query, where, DocumentData } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import app from '@/Config/FirebaseConfig';


function StorageInfo() {
    const {data:session}=useSession();
    const db=getFirestore(app)

    const [totalSizeUsed,setTotalSizeUsed]=useState<string>("0 MB");
    const [imageSize,setImageSize]=useState<number>(0);
    const [videoSize, setVideoSize] = useState(0);
    const [documentSize, setDocumentSize] = useState(0);
    const [audioSize, setAudioSize] = useState(0);
    const [otherSize, setOtherSize] = useState(0);
    const [fileList,setFileList]=useState<DocumentData[]>([])

    const [imageCount, setImageCount] = useState(0);
    const [videoCount, setVideoCount] = useState(0);
    const [documentCount, setDocumentCount] = useState(0);
    const [audioCount, setAudioCount] = useState(0);
    const [otherCount, setOtherCount] = useState(0);

    const typeMap = {
      Images: ["png", "jpg", "jpeg", "gif", "webp"],
      Videos: ["mp4", "mov", "avi", "mkv"],
      Documents: ["pdf", "docx", "pptx", "txt", "xlsx"],
      Audio: ["mp3", "wav", "aac", "ogg"],
    };


    useEffect(()=>{
        if(session)
        {
            getAllFiles();

        }
    },[session])

    useEffect(()=>{

        let total = 0;
        let image = 0,
          video = 0,
          document = 0,
          audio = 0;

        let imgCount = 0,
          vidCount = 0,
          docCount = 0,
          audCount = 0;

        fileList.forEach((file) => {
        const ext = file.name?.split('.').pop()?.toLowerCase() || '';
        const sizeMB = file.size / 1024 / 1024;
        total += sizeMB;

        if (typeMap.Images.includes(ext)) {
          image += sizeMB;
          imgCount++;
        } else if (typeMap.Videos.includes(ext)) {
          video += sizeMB;
          vidCount++;
        } else if (typeMap.Documents.includes(ext)) {
          document += sizeMB;
          docCount++;
        } else if (typeMap.Audio.includes(ext)) {
          audio += sizeMB;
          audCount++;
        }
      });

      const knownTotal = image + video + document + audio;
      const knownCount = imgCount + vidCount + docCount + audCount;
      const others = total - knownTotal;
      const otherCount = fileList.length - knownCount;

      setImageSize(image);
      setVideoSize(video);
      setDocumentSize(document);
      setAudioSize(audio);
      setOtherSize(Number(others.toFixed(2)));

      setImageCount(imgCount);
      setVideoCount(vidCount);
      setDocumentCount(docCount);
      setAudioCount(audCount);
      setOtherCount(otherCount);

      setTotalSizeUsed(total.toFixed(2) + ' MB');
      },[fileList]);

      const getAllFiles=async()=>{
        if (session?.user?.email) {
          const q=query(collection(db,"files"),
          where("createdBy","==",session.user.email));
          const querySnapshot = await getDocs(q);
          const allFiles: DocumentData[] = [];

          querySnapshot.forEach((doc)=>{
            allFiles.push(doc.data());
          })
          setFileList(allFiles)
      }
    }

  return (
<div className="mt-7 w-full max-w-full">
  <h2 className="text-lg sm:text-xl font-semibold">
    {totalSizeUsed}
    <span className="ml-1 text-sm font-normal text-gray-500">used</span>
  </h2>

  <div className="w-full bg-gray-200 h-2.5 flex mt-2 rounded overflow-hidden">
    {imageSize > 0 && (
      <div className="bg-green-400 h-2.5" style={{ width: `${(imageSize / (imageSize + videoSize + documentSize + audioSize + otherSize)) * 100}%` }}></div>
    )}
    {videoSize > 0 && (
      <div className="bg-blue-400 h-2.5" style={{ width: `${(videoSize / (imageSize + videoSize + documentSize + audioSize + otherSize)) * 100}%` }}></div>
    )}
    {documentSize > 0 && (
      <div className="bg-yellow-400 h-2.5" style={{ width: `${(documentSize / (imageSize + videoSize + documentSize + audioSize + otherSize)) * 100}%` }}></div>
    )}
    {audioSize > 0 && (
      <div className="bg-purple-400 h-2.5" style={{ width: `${(audioSize / (imageSize + videoSize + documentSize + audioSize + otherSize)) * 100}%` }}></div>
    )}
    {otherSize > 0 && (
      <div className="bg-red-400 h-2.5" style={{ width: `${(otherSize / (imageSize + videoSize + documentSize + audioSize + otherSize)) * 100}%` }}></div>
    )}
  </div>
  {[
  {
    label: "Images",
    count: imageCount,
    size: imageSize,
    iconBg: "bg-green-200 text-green-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    ),
  },
  {
    label: "Videos",
    count: videoCount,
    size: videoSize,
    iconBg: "bg-blue-200 text-blue-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    ),
  },
  {
    label: "Documents",
    count: documentCount,
    size: documentSize,
    iconBg: "bg-yellow-200 text-yellow-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
  {
    label: "Audios",
    count: audioCount,
    size: audioSize,
    iconBg: "bg-purple-200 text-purple-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    ),
  },
  {
    label: "Others",
    count: otherCount,
    size: otherSize,
    iconBg: "bg-red-200 text-red-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    ),
  },
].map((item) => (
  <div key={item.label} className="flex justify-between items-center mt-2 border-b pb-1 flex-wrap sm:flex-nowrap gap-2 sm:gap-1">
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md p-1.5 ${item.iconBg}`}
      >
        {item.icon}
      </svg>
      <div className="min-w-[70px]">
        <h2 className="text-xs sm:text-sm font-medium">{item.label}</h2>
        <p className="text-[10px] sm:text-xs text-gray-500">{item.count} {item.label.toLowerCase()}</p>
      </div>
    </div>
    <div className="text-xs sm:text-sm font-medium text-gray-600">{item.size.toFixed(2)} MB</div>
  </div>
))}

</div>

  )
}

export default StorageInfo