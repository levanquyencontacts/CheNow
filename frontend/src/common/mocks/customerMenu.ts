import { NAV_LINKS } from "./customerHome";

export { NAV_LINKS };

export const MENU_CATEGORIES = [
  { id: "all", name: "Tất cả", count: 45 },
  { id: "hot", name: "Món nổi bật", count: 12 },
  { id: "milktea", name: "Trà sữa", count: 22 },
  { id: "fruit", name: "Trà trái cây", count: 15 },
  { id: "macchiato", name: "Macchiato", count: 6 },
  { id: "coffee", name: "Cà phê", count: 5 },
];

export const TOPPINGS = [
  { id: "pearl", name: "Trân châu đen", price: 7000 },
  { id: "cheese", name: "Kem cheese", price: 10000 },
  { id: "pudding", name: "Pudding trứng", price: 8000 },
  { id: "aloe", name: "Nha đam", price: 6000 },
];

export const PRODUCTS = [
  {
    id: 1,
    categoryId: "hot",
    name: "Xanh Nhài Mơ Mận",
    price: 33000,
    tag: "Mới",
    rating: 4.8,
    sold: 1280,
    desc: "Trà xanh nhài ủ lạnh cùng mơ mận chua ngọt, hậu vị thanh nhẹ.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvFqOp7_XqoXS1BksaF-_LnSZR1CP6C2razOqyKL1OwHcKUz53dRa0Y3EWJa-Ewf0VcLxniOUrw6GbMRS1ASwn0PnuYlH6hQjl_5lj4xUbANEeCcTGdm2HLs2zxEes2GNupEtErPMO3W4PaGxbD4UTOMg_mrmKpdrz_tR6Wuy9xDUspq61JsVZT8l3PyHlSYnqRh-TuNR5Ha5Ogg_B47JtRtdU5qZ0kovOYfro7Y3cDzU1wiUrNkdw9VA",
    bg: "bg-[#eefbf3]",
  },
  {
    id: 2,
    categoryId: "fruit",
    name: "Ô Long Dứa Băng Tuyết",
    price: 30000,
    tag: "Bán chạy",
    rating: 4.9,
    sold: 2140,
    desc: "Ô long rang thơm, dứa tươi và lớp đá tuyết mát lạnh.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvWLr45mV8MfC8Vi58auOx5Wb9biqSslze1w_jBOWpPL7Xw-5ew0sBjy2pPZk0Cf3EP7fNMDlF29PYAPBgHa1ORcPQcE8a5zJTcCfO5h0LvIKZX5fUX1553adyisFvBll6kU53yUVHhVn5tO3m_cO-pmAEpYzUnx5Ko4LQ-duI6rB7ggxqxP4QaeLgWPtIVr-odikeDNcNkkDuRJLWvT6AEsc_QDa9lisX6MO1FjRfzPc1usOJ5X23MTQ",
    bg: "bg-[#fff8e1]",
  },
  {
    id: 3,
    categoryId: "macchiato",
    name: "Xanh Nhài Matcha Tươi Kem Phô Mai",
    price: 35000,
    tag: "Mới",
    rating: 4.7,
    sold: 980,
    desc: "Matcha tươi, nền trà xanh nhài và kem phô mai mằn mặn.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvp46gux7fWNv1KYdINSrG9GJClA-adlfW9GvwnFdL7FGEuTfSnhGSwLe5AikZ_wSXiYhqeXhKv6Ap2MB52RO2v1E2zFTuxWwL6HsX9ktk_k_U5KZbmDXkYdhsaAnsiy1ebRjRCEeHwsi5TUZGHOauorTrhf11hLty1wummqo8H6vJvEt8povBAmaeN2XTmUUX7aJnhjHBN50L9mYLO6WhXAIZN0rG8e1wfedJ402IYw8_0JjdC1SR40Q",
    bg: "bg-[#f0fdf4]",
  },
  {
    id: 4,
    categoryId: "milktea",
    name: "Trà Sữa Hạnh Phúc",
    price: 30000,
    tag: "Ưu đãi",
    rating: 4.6,
    sold: 1530,
    desc: "Trà đen đậm vị, sữa tươi béo nhẹ, dễ uống mỗi ngày.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsk5P-glD49KnSgOsHAfa3poHpB4SstEcZF1tZUaQR6rRxhpB44PaAYk-vcvVXVf5O-V79GKAndAD6QLEuQ175-s2381TPQGUOtDQq6DjFPK5NJxGtqEh8xeoZLfa5wqabaKL2UGeHzpW1-AJEVX3c_NzoVRuaKMr6rJX1d1bpP2_sKXBAVWaJG7aqGk70aLeqT76Jx0H04LUu9MbCAnY08GFR51V_o5oGtiiFfsRkBpSfkXpHErKOq",
    bg: "bg-[#fff4ec]",
  },
  {
    id: 5,
    categoryId: "macchiato",
    name: "Oolong Đào Quế Hoa Kem Cheese",
    price: 35000,
    rating: 4.8,
    sold: 1760,
    desc: "Ô long đào thơm, quế hoa dịu và kem cheese phủ mịn.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvWLr45mV8MfC8Vi58auOx5Wb9biqSslze1w_jBOWpPL7Xw-5ew0sBjy2pPZk0Cf3EP7fNMDlF29PYAPBgHa1ORcPQcE8a5zJTcCfO5h0LvIKZX5fUX1553adyisFvBll6kU53yUVHhVn5tO3m_cO-pmAEpYzUnx5Ko4LQ-duI6rB7ggxqxP4QaeLgWPtIVr-odikeDNcNkkDuRJLWvT6AEsc_QDa9lisX6MO1FjRfzPc1usOJ5X23MTQ",
    bg: "bg-[#fff8e1]",
  },
  {
    id: 6,
    categoryId: "milktea",
    name: "Trà Sữa Trân Châu Hoàng Gia",
    price: 30000,
    tag: "Bán chạy",
    rating: 4.9,
    sold: 2960,
    desc: "Vị trà sữa truyền thống, trân châu dai mềm và hậu trà thơm.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMazeqg4PKc5rbNUthz6bT-YEDkTnrNUk3mCc6ckgC1K_PAVkJAyMlYQ08x7AASio77-DyjWYEqhFtihKS5foCQW_d2NXQzQaS-X8JWVV2fgjBp7y-EN9rncuOxl50QjMDhXkmssHmiLmXHcXTGQzZ116KjlMNdcn8eg0sXQpW1JYmp9i9F0A1282bbqJOwYH0beV8JTPaPZ6dNJNm9Ulhue3W7dekMIAiDJT1_Kg4BQgZCJnG0Ud1lNBYEXtHimvWzgrXpjfkpA",
    bg: "bg-[#f0fdf4]",
  },
];

export const FALLBACK_PRODUCT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCMazeqg4PKc5rbNUthz6bT-YEDkTnrNUk3mCc6ckgC1K_PAVkJAyMlYQ08x7AASio77-DyjWYEqhFtihKS5foCQW_d2NXQzQaS-X8JWVV2fgjBp7y-EN9rncuOxl50QjMDhXkmssHmiLmXHcXTGQzZ116KjlMNdcn8eg0sXQpW1JYmp9i9F0A1282bbqJOwYH0beV8JTPaPZ6dNJNm9Ulhue3W7dekMIAiDJT1_Kg4BQgZCJnG0Ud1lNBYEXtHimvWzgrXpjfkpA";

export const PRODUCT_BACKGROUNDS = ["bg-[#eefbf3]", "bg-[#fff8e1]", "bg-[#f0fdf4]", "bg-[#fff4ec]"];
