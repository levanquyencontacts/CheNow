import AuthService from "./controllers/auth/AuthServices";
import apiClient from "./apiClient";
import testApiService from "./controllers/testapi/testApiServices";
import UserService from "./controllers/user/UserServices";
import { FileService } from "./file/FileServices";
import { CategoriesService } from "./controllers/categories/CategoriesService";
import { ProductsService } from "./controllers/products/ProductsService";
import { CustomerProductsService } from "./controllers/customer-products/CustomerProductsService";
import { ToppingsService } from "./controllers/toppings/ToppingsService";
import { CategorySizesService } from "./controllers/category-sizes/CategorySizesService";
import { OrdersService } from "./controllers/orders/OrdersService";
import { AiAssistantService } from "./controllers/ai-assistant/AiAssistantService";
import { DashboardService } from "./controllers/dashboard/DashboardService";
import { ChatService } from "./controllers/chat/ChatService";

class ApiServices {
  public auth: AuthService;
  public testApi: testApiService;
  public user: UserService;
  public categories: CategoriesService;
  public products: ProductsService;
  public customerProducts: CustomerProductsService;
  public toppings: ToppingsService;
  public categorySizes: CategorySizesService;
  public orders: OrdersService;
  public dashboard: DashboardService;
  public aiAssistant: AiAssistantService;
  public file: FileService;
  public chat: ChatService;

  constructor() {
    this.auth = new AuthService(apiClient);
    this.testApi = new testApiService(apiClient);
    this.user = new UserService(apiClient);
    this.categories = new CategoriesService(apiClient);
    this.products = new ProductsService(apiClient);
    this.customerProducts = new CustomerProductsService(apiClient);
    this.toppings = new ToppingsService(apiClient);
    this.categorySizes = new CategorySizesService(apiClient);
    this.orders = new OrdersService(apiClient);
    this.dashboard = new DashboardService(apiClient);
    this.aiAssistant = new AiAssistantService(apiClient);
    this.file = new FileService(apiClient);
    this.chat = new ChatService(apiClient);
  }
}

const api = new ApiServices();

export default api;
