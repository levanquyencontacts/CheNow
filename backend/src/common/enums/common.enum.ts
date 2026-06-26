export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
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

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum CustomerRank {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
}

export enum CustomerGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
