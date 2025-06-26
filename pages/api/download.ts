import type { NextApiRequest, NextApiResponse } from "next";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import fetch from "node-fetch"; // make sure to add node-fetch to your project

// Initialize Firebase Storage in your server environment here if needed
// Or import your initialized storage instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { filePath, fileName } = req.query;

    if (typeof filePath !== "string" || typeof fileName !== "string") {
      return res.status(400).json({ error: "Missing filePath or fileName" });
    }

    // Get download URL from Firebase Storage
    const storage = getStorage(); // or your initialized storage instance
    const fileRef = ref(storage, filePath);
    const downloadUrl = await getDownloadURL(fileRef);

    // Fetch the file content server-side (Node.js, no CORS issues)
    const fileResponse = await fetch(downloadUrl);

    if (!fileResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch file from storage" });
    }

    // Set headers to force download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", fileResponse.headers.get("content-type") || "application/octet-stream");

    // Stream the file data to client
    if (!fileResponse.body) {
        return res.status(500).json({ error: "No response body to stream" });
    }
    fileResponse.body.pipe(res);
  } catch (error) {
    console.error("Download API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
