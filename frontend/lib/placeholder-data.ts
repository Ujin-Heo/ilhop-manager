import { Menu } from "radix-ui/internal";
import { TableStatus, OrderDetail, MenuResponse } from "./definitions";

export const tableInfos: TableStatus[] = [
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 3,
    gridRow: 1,
    gridCol: 1,
    isAvailable: true,
    currentCustomer: {
      customerId: "550e8400-e29b-41d4-a716-446655440000",
      entryTime: "2026-05-02T02:30:30Z",
      isActive: true,
    },
  },
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 22,
    gridRow: 4,
    gridCol: 8,
    isAvailable: true,
    currentCustomer: {
      customerId: "550e8400-e29b-41d4-a716-446655440000",
      entryTime: "2026-05-02T02:25:30Z",
      isActive: true,
    },
  },
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 7,
    gridRow: 3,
    gridCol: 2,
    isAvailable: true,
    currentCustomer: null,
  },
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 12,
    gridRow: 2,
    gridCol: 6,
    isAvailable: true,
    currentCustomer: null,
  },
];

export const ordersData: OrderDetail[] = [
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    tableNum: 7,
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    orderTime: "2024-04-12T19:00:00Z",
    totalPrice: 30000,
    depositor: null,
    isPaid: true,
    memo: "현금 결제 완료",
    items: [
      {
        menuName: "치킨 가라아게",
        quantity: 2,
        selectedOption: null,
        isServed: false,
      },
      {
        menuName: "좋은 토닉",
        quantity: 1,
        selectedOption: "살구맛",
        isServed: true,
      },
    ],
  },
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    tableNum: 12,
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    orderTime: "2024-04-12T19:00:00Z",
    totalPrice: 250000,
    depositor: "홍길동",
    isPaid: true,
    memo: null,
    items: [
      {
        menuName: "치킨 가라아게",
        quantity: 2,
        selectedOption: null,
        isServed: true,
      },
    ],
  },
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    tableNum: 14,
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    orderTime: "2024-04-12T19:00:00Z",
    totalPrice: 250000,
    depositor: "김길동",
    isPaid: false,
    memo: null,
    items: [
      {
        menuName: "치킨 가라아게",
        quantity: 2,
        selectedOption: null,
        isServed: false,
      },
    ],
  },
];


export const menuData: MenuResponse[] = [
  {
    "menuId": "550e8400-e29b-41d4-a716-446655440000",
    "section": "안주류",
    "menuName": "치킨 가라아게",
    "price": 15000,
    "imageUrl": "https://i.namu.wiki/i/b7y5ZQOQnUzuKlMA43u_gqzZKMPhUzr_gYoi6Wph-CsKhekz9u-J5u62XWteWksPD-mFPrgu_zsv_vB_1axmYw.webp",
    "options": null
  },
  {
    "menuId": "550e8400-e29b-41d4-a716-446655440001",
    "section": "주류",
    "menuName": "좋은 토닉",
    "price": 6000,
    "imageUrl": "https://image.fnnews.com/resource/media/image/2023/12/21/202312211316405332_l.jpg",
    "options": [
      "살구맛",
      "청포도맛",
      "레몬맛"
    ]
  }
]