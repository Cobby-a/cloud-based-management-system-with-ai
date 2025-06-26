// import { initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: "cloud-based-19231.firebaseapp.com",
//   projectId: "cloud-based-19231",
//   storageBucket: "cloud-based-19231.firebasestorage.app",
//   messagingSenderId: "813151022448",
//   appId: "1:813151022448:web:54c7f7069e073afee173b5",
//   measurementId: "G-6DZVPJ86K3"
// };

// const app = initializeApp(firebaseConfig);
// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) {
//       getAnalytics(app);
//     }
//   });
// }


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "virtual-uni-e3c76.firebaseapp.com",
  projectId: "virtual-uni-e3c76",
  storageBucket: "virtual-uni-e3c76.appspot.com",
  messagingSenderId: "796661888835",
  appId: "1:796661888835:web:056c72cd0f9c8503fc61f6"
};

const app = initializeApp(firebaseConfig);
export default app;