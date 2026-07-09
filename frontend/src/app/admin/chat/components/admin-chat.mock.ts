import { ChatConversation, ChatMessage } from "@/services/types/apiType";

export const conversations: ChatConversation[] = [
  {
    id: 1,
    customer: "Nguyễn Minh Anh",
    phone: "0900 128 456",
    lastMessage: "Mình muốn hỏi đơn matcha giao khoảng mấy phút?",
    time: "2 phút",
    unread: 2,
    status: "Đang chờ",
    orderCode: "CN-1042",
    channel: "Website",
  },
  {
    id: 2,
    customer: "Trần Quốc Bảo",
    phone: "0912 222 888",
    lastMessage: "Có topping kem cheese không shop?",
    time: "12 phút",
    unread: 1,
    status: "Đang tư vấn",
    orderCode: "Chưa có đơn",
    channel: "Menu",
  },
  {
    id: 3,
    customer: "Linh Phạm",
    phone: "0988 771 002",
    lastMessage: "Cảm ơn shop nha.",
    time: "1 giờ",
    unread: 0,
    status: "Đã xử lý",
    orderCode: "CN-1036",
    channel: "Website",
  },
];

export const messages: ChatMessage[] = [
  {
    id: 1,
    author: "customer",
    text: "Chào shop, mình muốn hỏi đơn matcha giao khoảng mấy phút?",
    time: "10:24",
  },
  {
    id: 2,
    author: "staff",
    text: "CheNow chào bạn. Khu vực nội thành Hà Nội thường giao trong 25-35 phút sau khi xác nhận đơn.",
    time: "10:25",
  },
  {
    id: 3,
    author: "customer",
    text: "Nếu mình đặt 4 ly thì có freeship không?",
    time: "10:26",
  },
];

export const quickAnswers = [
  "Dạ đơn từ 120.000đ được freeship trong khu vực hỗ trợ.",
  "Bạn cho mình xin mã đơn để kiểm tra nhanh nhé.",
  "Món này có thể chọn size, đường, đá và topping theo ý bạn.",
];

export const chatStats = [
  ["5", "Đang chờ"],
  ["18", "Hôm nay"],
  ["92%", "Phản hồi"],
] as const;
