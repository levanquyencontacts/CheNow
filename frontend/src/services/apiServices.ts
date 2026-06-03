import AuthService from "./controllers/auth/AuthServices";
import apiClient from "./apiClient";
import testApiService from "./controllers/testapi/testApiServices";
import UserService from "./controllers/user/UserServices";
import { FileService } from "./file/FileServices";

class ApiServices {
  public auth: AuthService;
  public testApi: testApiService;
  public user: UserService;
  public file: FileService;

  constructor() {
    this.auth = new AuthService(apiClient);
    this.testApi = new testApiService(apiClient);
    this.user = new UserService(apiClient);
    this.file = new FileService(apiClient);
  }
}

const api = new ApiServices();

export default api;
