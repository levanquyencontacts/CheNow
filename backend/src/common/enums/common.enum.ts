export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum RoleCode {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum CustomerRank {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  DIAMOND = 'diamond',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'take_away',
  DELIVERY = 'delivery',
}

export enum PaymentMethod {
  CASH = 'cash',
  MOMO = 'momo',
  VNPAY = 'vnpay',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/** Customer my-orders list group filter */
export enum OrderListScope {
  ACTIVE = 'active',
  HISTORY = 'history',
}

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
];

export const HISTORY_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
];

export enum ConversationUserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}
