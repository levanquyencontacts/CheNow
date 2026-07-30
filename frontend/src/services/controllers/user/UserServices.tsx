import type {
  AccountRoleCode,
  AdminUsersResponse,
  AuthUser,
  UpdateUserPayload,
} from "@/services/types/apiType";
import type { AxiosInstance } from "axios";

interface UploadImageResponse {
  fileName: string;
}

class UserService {
  constructor(private readonly apiClient: AxiosInstance) {}

  getMe = async (): Promise<AuthUser> => {
    const { data } = await this.apiClient.get<AuthUser>("/users/me");
    return data;
  };

  updateMe = async ({
    id,
    ...payload
  }: UpdateUserPayload): Promise<AuthUser> => {
    void id;

    const { data } = await this.apiClient.put<AuthUser>("/users/me", payload);

    return data;
  };

  getAdminUsers = async (params?: {
    page?: number;
    limit?: number;
    searchValue?: string;
  }): Promise<AdminUsersResponse> => {
    const { data } = await this.apiClient.get<AdminUsersResponse>(
      "/admin/users",
      { params },
    );
    return data;
  };

  changeRole = async (
    userId: number,
    roleCode: AccountRoleCode,
  ): Promise<void> => {
    await this.apiClient.patch(`/admin/users/${userId}/role`, { roleCode });
  };

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

export default UserService;
