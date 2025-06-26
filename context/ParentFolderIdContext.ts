import { createContext } from "react";

// export const ParentFolderIdContext=createContext(null)
export type ParentFolderIdContextType = {
  parentFolderId: string | null;
  setParentFolderId: (id: string | null) => void;
};

export const ParentFolderIdContext = createContext<ParentFolderIdContextType | null>(null);