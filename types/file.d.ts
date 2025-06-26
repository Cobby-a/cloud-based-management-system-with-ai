export interface FileType {
  id: number;
  name: string;
  size: number;
  type: string;
  modifiedAt: number;
  createdBy?: string; // Owner's email
  parentFolderId?: string;
  imageUrl?: string;
}
