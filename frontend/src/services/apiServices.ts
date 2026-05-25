import AuthService from "./controllers/auth/AuthServices";
import apiClient from "./apiClient";

class ApiServices {
  public auth: AuthService;

  constructor() {
    this.auth = new AuthService(apiClient);
  }
}

const api = new ApiServices();

export default api;
