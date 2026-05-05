export type UUID = string;
export type ISOString = string;

// --- Table Interfaces ---

export interface TableCreateRequest {
  tableNum: number;
  gridRow: number;
  gridCol: number;
  isAvailable?: boolean;
}

export interface TableUpdateRequest {
  tableNum?: number;
  isAvailable?: boolean;
}

export interface TableStatus {
  tableId: UUID;
  tableNum: number;
  gridRow: number;
  gridCol: number;
  isAvailable: boolean;
  currentCustomer: CustomerBrief | null;
}

// --- Customer Interfaces ---

export interface CustomerCreateRequest {
  tableNum: number;
}

export interface CustomerBrief {
  customerId: UUID;
  entryTime: ISOString;
  isActive: boolean;
}

// --- Menu Interfaces ---

export interface MenuCreateRequest {
  menuName: string;
  price: number;
  imageUrl?: string | null;
  options?: string[] | null;
}

export interface MenuResponse {
  menuId: UUID;
  section: string;
  menuName: string;
  price: number;
  imageUrl: string | null;
  options: string[] | null;
}

// --- Order & OrderItem Interfaces ---

export interface OrderCreateRequest {
  customerId: UUID;
  totalPrice: number;
  depositor?: string | null;
  items: OrderItemRequest[];
}

export interface OrderCreateResponse {
  orderId: UUID;
  orderTime: ISOString;
  totalPrice: number;
  depositor: string | null;
  items: OrderItemBrief[] | null;
}

export interface OrderPaymentUpdateRequest {
  isPaid: boolean;
}

export interface OrderPaymentUpdateResponse {
  orderId: UUID;
  isPaid: boolean;
}

export interface OrderMemoUpdateRequest {
  memo: string;
}

export interface OrderMemoUpdateResponse {
  orderId: UUID;
  memo: string;
}

export interface OrderDetail {
  orderId: UUID;
  tableNum: number;
  customerId: UUID;
  orderTime: ISOString;
  totalPrice: number;
  depositor: string | null;
  isPaid: boolean;
  memo: string | null;
  items: OrderItemBrief[] | null;
}

export interface OrderSummaryResponse {
  totalAmount: number;
  orderItems: OrderItemSummaryResponse[];
}

export interface OrderItemRequest {
  menuId: UUID;
  quantity: number;
  priceAtOrder: number;
  selectedOption?: string | null;
}

export interface OrderItemServedUpdateRequest {
  isServed: boolean;
}

export interface OrderItemServedUpdateResponse {
  orderId: UUID;
  menuId: UUID;
  selectedOption: string | null;
  isServed: boolean;
}

export interface OrderItemBrief {
  menuName: string;
  quantity: number;
  selectedOption: string | null;
  isServed: boolean;
}

export interface OrderItemSummaryResponse {
  menuName: string;
  totalQuantity: number;
  unitPrice: number;
  selectedOption: string | null;
}

// --- Miscellaneous ---

export interface PaymentConfirmInfo {
  title?: string | null;
  message?: string | null;
  app?: string | null;
}

export interface ErrorResponse {
  code: string;
  message: string;
}

// --- WebSocket Message Interfaces ---

export interface OrderCreatedMessage {
  event: 'ORDER_CREATED';
  data: OrderDetail;
}

export interface PaymentConfirmedMessage {
  event: 'PAYMENT_CONFIRMED';
  data: OrderPaymentUpdateResponse;
}

export interface ItemServedUpdatedMessage {
  event: 'ITEM_SERVED_UPDATED';
  data: OrderItemServedUpdateResponse;
}

export type WebSocketMessage =
  | OrderCreatedMessage
  | PaymentConfirmedMessage
  | ItemServedUpdatedMessage;
