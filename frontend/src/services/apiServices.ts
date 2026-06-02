import AuthService from "./controllers/auth/AuthServices";
import apiClient from "./apiClient";
import testApiService from "./controllers/testapi/testApiServices";

class ApiServices {
  public auth: AuthService;
  public testApi: testApiService;

  constructor() {
    this.auth = new AuthService(apiClient);
    this.testApi = new testApiService(apiClient);
  }
}

const api = new ApiServices();

export default api;
