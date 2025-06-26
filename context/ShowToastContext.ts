import { createContext } from "react";


export type ShowToastContextType = {
  showToastMsg: string | null;
  setShowToastMsg: (msg: string | null) => void;
};


// export const ShowToastContext=createContext(null)

export const ShowToastContext = createContext<ShowToastContextType | null>(null);
