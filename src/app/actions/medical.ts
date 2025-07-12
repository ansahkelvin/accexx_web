"use server"
import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {FileRecord} from "@/app/(patients)/patients/evidence/page";

export  async function fetchMedicalFiles() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    if (!accessToken) {
        throw new Error("Could not fetch access_token");
    }
    
    try{
        const response = await fetch(`${BASE_URL}/documents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        })
        if (!response.ok) {
            throw new Error("Could not fetch documents");
        }
        
        const documents = await response.json();
        
        // Transform to match FileRecord interface
        const fileRecords: FileRecord[] = documents.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            description: doc.description || '',
            url: doc.fileUrl,
            uploaded_at: doc.uploadedAt,
            created_at: doc.createdAt,
            updated_at: doc.updatedAt
        }));
        
        console.log("document", fileRecords);
        return fileRecords;
        
    }catch (e) {
        console.error(e);
    }
}

interface UploadMedicalParams {
    description: string;
    document: File;
    name: string;
}

interface UploadResponse {
    id: string;
    name: string;
    description: string;
    url: string;
    // Add other properties returned by your API
}

export async function uploadMedical({
                                        description,
                                        document,
                                        name
                                    }: UploadMedicalParams): Promise<UploadResponse> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Could not fetch access_token");
    }

    try {
        // Create a FormData object to properly handle file upload
        const formData = new FormData();
        formData.append('description', description);
        formData.append('name', name);
        formData.append('file', document); // Changed from 'document' to 'file' to match API

        const response = await fetch(`${BASE_URL}/documents/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
                // Note: Don't set Content-Type when using FormData
                // The browser will set it automatically with the correct boundary
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("document uploaded:", result);
        return result;

    } catch (e) {
        console.error("Error uploading document:", e);
        throw e; // Re-throw to allow caller to handle the error
    }
}