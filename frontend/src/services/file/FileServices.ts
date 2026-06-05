import { AxiosInstance } from "axios";

interface UploadImageResponse {
    fileName: string;
}

export class FileService {
    constructor(private readonly apiClient: AxiosInstance) { }
    getBaseUrl() {
        return this.apiClient.defaults.baseURL;
    }
    getOriginalImageUrl(filename: string) {
        const trimmed = filename.trim();
        if (!trimmed) return '';
        const base = this.getBaseUrl();
        return `${base}/file/image/originals/${trimmed}`;
    }
    getThumbnailUrl(filename: string) {
        const trimmed = filename.trim();
        if (!trimmed) return '';
        const base = this.getBaseUrl();
        return `${base}/file/image/thumbnails/${trimmed}`;
    }
    uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await this.apiClient.post<UploadImageResponse>(
            "/file/image",
            formData,
        );

        return data.fileName;
    };
}
