import { AxiosInstance } from "axios";

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
}
