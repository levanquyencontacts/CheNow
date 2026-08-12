# Direct Checkout — API Implementation Plan (Phase 1)

> **Status:** Phase 1 (API) — **implementation complete, ready for manual QA**  
> **Phase 2 (Web FE):** deferred → see [`2026-08-11-direct-checkout-fe-web.md`](./2026-08-11-direct-checkout-fe-web.md)  
> **Last review:** 2026-08-12 — Tech Lead review round 1: no blockers; see [Review Log](#review-log) and [Manual QA](#api-manual-qa-postman--curl)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Backend hỗ trợ 2 luồng tạo đơn tách biệt — giỏ hàng và đặt ngay — dùng chung `createFromSnapshots()`, giá validate/tính server-side.

**Architecture:** `OrderItemOptionsService` validate + build snapshot. Hai HTTP entry:
- `POST /customer/cart/checkout` — nguồn từ server cart
- `POST /orders/direct` — nguồn từ body món trực tiếp, **không đụng cart**

**Tech Stack:** NestJS + TypeORM

## Global Constraints (API)

- `POST /orders/direct` không gọi/read/write bảng `carts` / `cart_items`
- Cả hai endpoint tạo đơn đều qua `OrdersService.createFromSnapshots()`
- `shippingFee` optional từ client (server chưa tự tính)
- `POST /orders` (client-priced) giữ cho admin/legacy — **không** dùng cho customer flow mới
- Tránh circular dependency: shared logic ở `OrderItemsModule`

---

## Nguyên tắc thiết kế

```
                    ┌─────────────────────────────┐
                    │  createFromSnapshots()      │
                    └─────────────▲───────────────┘
                                  │
              ┌───────────────────┴───────────────────┐
              │                                       │
   POST /customer/cart/checkout          POST /orders/direct
   (cartItemIds từ server cart)          (productId, size, qty, toppings…)
```

| | Cart checkout | Direct order |
|--|---------------|--------------|
| Endpoint | `POST /customer/cart/checkout` | `POST /orders/direct` |
| Auth | Customer JWT | Customer JWT |
| Nguồn món | `cartItemIds` | Request body |
| Đụng cart DB | Có (xóa item đã checkout) | **Không** |
| Giá | Server | Server |

---

## File Map (Backend only)

| File | Responsibility |
|------|----------------|
| `backend/src/modules/order-items/order-item-options.service.ts` | Validate + build price snapshot |
| `backend/src/modules/order-items/order-items.module.ts` | Export shared service |
| `backend/src/modules/orders/dto/create-direct-order.dto.ts` | DTO đặt ngay |
| `backend/src/modules/orders/orders.service.ts` | `createDirectOrder()` |
| `backend/src/modules/orders/orders.controller.ts` | `POST /orders/direct` |
| `backend/src/modules/orders/orders.service.direct.spec.ts` | Unit tests direct order |
| `backend/src/modules/carts/carts.service.ts` | Checkout dùng shared service |
| `backend/src/modules/carts/carts.service.checkout.spec.ts` | Unit tests checkout |

---

## API Contract

### `POST /orders/direct`

**Headers:** `Authorization: Bearer <customer_jwt>`

**Body:**

```json
{
  "productId": 1,
  "categorySizeId": 2,
  "quantity": 2,
  "toppingIds": [3, 5],
  "note": "Ít đường",
  "orderType": "delivery",
  "paymentMethod": "cash",
  "addressId": 10,
  "shippingFee": 15000
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `productId`, `categorySizeId`, `quantity` | Yes | `quantity >= 1` |
| `toppingIds` | No | `number[]`, unique |
| `note` | No | max 200 chars — **ghi chú món** (lưu vào `order_items.note`), không phải ghi chú đơn |
| `orderType` | Yes | `delivery` \| `take_away` \| `dine_in` |
| `paymentMethod` | Yes | `cash` \| `momo` \| `vnpay` |
| `addressId` | Required when `orderType=delivery` | Must belong to current user |
| `shippingFee` | No | default `0` |

**Success:** Order entity (`id`, `invoiceCode`, `subtotalAmount`, `totalAmount`, `orderItems`, …)

**Errors (400):**
- Product inactive / size wrong category / invalid toppings
- Delivery without valid `addressId`

---

### `POST /customer/cart/checkout`

**Headers:** `Authorization: Bearer <customer_jwt>`

**Body:**

```json
{
  "cartItemIds": [101, 102],
  "orderType": "delivery",
  "paymentMethod": "cash",
  "addressId": 10,
  "note": "Giao giờ trưa",
  "shippingFee": 0
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `cartItemIds` | Yes | min 1, unique |
| `orderType` | Yes | `delivery` \| `take_away` \| `dine_in` |
| `paymentMethod` | Yes | `cash` \| `momo` \| `vnpay` |
| `addressId` | Required when `orderType=delivery` | Must belong to current user |
| `note` | No | max 500 chars — **ghi chú đơn** (lưu vào `orders.note`) |
| `shippingFee` | No | default `0` |

**Behavior:** Validate + price server-side → create order → delete only checked-out `cartItemIds`.

**Semantics `note` (quan trọng khi QA):**

| Luồng | `note` trong body | Lưu ở đâu |
|-------|-------------------|-----------|
| Direct order | Ghi chú tùy chỉnh món (vd. "Ít đường") | `order_items.note` |
| Cart checkout | Ghi chú giao hàng / đơn (vd. "Giao giờ trưa") | `orders.note` |

Ghi chú món trong giỏ vẫn nằm trên từng `cart_item` và được snapshot sang `order_items.note` khi checkout.

**Concurrency (đã implement thêm so với bản plan gốc):** `checkout` lock `cart_items` với `pessimistic_write` trước khi pricing/tạo đơn; checkout đồng thời trên cùng item → request thua trả `400 Selected cart items are invalid`.

---

## Task 1: Shared Order Item Options Service

- [x] Create `order-item-options.service.ts` + `order-items.module.ts`
- [x] Import `OrderItemsModule` into `CartsModule` and `OrdersModule`
- [x] Refactor `CartsService.checkout` to use `validateAndBuildSnapshot`
- [x] Run: `npm test -- carts.service.checkout.spec.ts` → PASS
- [x] Merged via PR #64

---

## Task 2: Direct Order API

- [x] Create `create-direct-order.dto.ts`
- [x] Implement `OrdersService.createDirectOrder()` → `createFromSnapshots`
- [x] Add `POST /orders/direct` (before `@Get(':id')`), guards: JwtAuth + CUSTOMER
- [x] Add `orders.service.direct.spec.ts` (happy path, delivery without address, shipping fee)
- [x] Update `orders.service.spec.ts` constructor DI (3rd arg `OrderItemOptionsService`)
- [x] Run: `npm test -- orders.service.direct.spec.ts orders.service.spec.ts` → PASS
- [x] Merged via PR #64

---

## API Manual QA (Postman / curl)

**Prerequisites:** Customer JWT; ít nhất 1 địa chỉ giao hàng thuộc user; sản phẩm ACTIVE có size/topping hợp lệ; giỏ có sẵn 2+ món cho các case cart.

**Công thức giá (để đối chiếu):**  
`subtotal = (product.price + size.extraPrice + Σ topping.price) × quantity`  
`totalAmount = subtotalAmount + shippingFee` (discount = 0)

### Direct order (`POST /orders/direct`)

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-API-01 | Happy path — delivery | Ghi nhận `GET /customer/cart` → `cartCount`. Gọi direct order: product ACTIVE, size đúng category, `quantity≥1`, toppings hợp lệ, `orderType=delivery`, `addressId` của user, `shippingFee=15000` | `200`; response có `invoiceCode`, `orderItems[0]` khớp product/size/qty; `subtotalAmount` đúng công thức; `totalAmount = subtotalAmount + 15000`; `orderItems[0].note` = note gửi lên (nếu có) |
| TC-API-02 | Cart không đổi | Sau TC-API-01, `GET /customer/cart` | `cartCount` và `items` giống trước TC-API-01 |
| TC-API-03 | Delivery thiếu `addressId` | `orderType=delivery`, không gửi `addressId` | `400` — `A valid delivery address is required` |
| TC-API-04 | `addressId` không thuộc user | `addressId` của user khác hoặc ID không tồn tại | `400` — `Delivery address not found for current user` |
| TC-API-05 | Product inactive | `productId` sản phẩm INACTIVE / không tồn tại | `400` — `Product is not available` |
| TC-API-06 | Size sai category | `categorySizeId` thuộc category khác product | `400` — `Category size does not match product category` |
| TC-API-07 | Topping không hợp lệ | `toppingIds` có ID không thuộc category | `400` — topping mismatch hoặc validation error |
| TC-API-08 | Takeaway — không cần address | `orderType=take_away`, không gửi `addressId` | `200`; không có snapshot địa chỉ giao |
| TC-API-09 | `shippingFee` mặc định | Không gửi `shippingFee` | `200`; `shippingFee = 0`; `totalAmount = subtotalAmount` |
| TC-API-10 | `quantity` không hợp lệ | `quantity = 0` hoặc âm | `400` validation |
| TC-API-11 | Note món | Gửi `note: "Ít đường"` | `200`; `orderItems[0].note = "Ít đường"`; `orders.note` null |

### Cart checkout (`POST /customer/cart/checkout`)

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-API-12 | Checkout 2 món | Thêm 2 món vào giỏ; checkout với `cartItemIds` cả 2 | `200`; order có 2 `orderItems`; giỏ trống |
| TC-API-13 | Partial checkout | Giỏ có món A + B; checkout chỉ `cartItemIds` của A | `200`; giỏ còn món B |
| TC-API-14 | `cartItemIds` không thuộc giỏ | Gửi ID không tồn tại / của user khác | `400` — `Selected cart items are invalid` |
| TC-API-15 | Delivery thiếu address | `orderType=delivery`, không `addressId` | `400` |
| TC-API-16 | Ghi chú đơn | Checkout với `note: "Giao giờ trưa"` | `200`; `orders.note = "Giao giờ trưa"` |
| TC-API-17 | Ghi chú món từ giỏ | Món trong giỏ có `note` khi add | `200`; `orderItems[i].note` giữ note từ cart item |
| TC-API-18 | Product inactive lúc checkout | Add món ACTIVE → admin deactivate product → checkout | `400` — `Product is not available`; **giỏ không bị xóa** |
| TC-API-19 | Rollback khi tạo đơn lỗi | Checkout fail giữa chừng (simulate nếu có thể) | Giỏ **không** mất item |
| TC-API-20 | `totalAmount` | Checkout với `shippingFee` tùy ý | `totalAmount = subtotalAmount + shippingFee` |

### Auth & pricing consistency

| ID | Scenario | Expected |
|----|----------|----------|
| TC-API-21 | Không token | `401` |
| TC-API-22 | Token role ADMIN/STAFF gọi direct / checkout | `403` (chỉ CUSTOMER) |
| TC-API-23 | Giá hiển thị giỏ vs checkout | `subtotalAmount` order = tổng `linePrice × qty` từ `GET /customer/cart` (cùng thời điểm, chưa đổi giá SP) |

### Regression

| ID | Scenario | Expected |
|----|----------|----------|
| TC-API-24 | `GET /orders/my-orders` sau tạo đơn | Đơn mới xuất hiện, status `pending` |
| TC-API-25 | `GET /orders/my-orders/:id` | Chi tiết khớp response lúc tạo |

---

## Review Log

### Round 1 — 2026-08-12

**Kết luận:** Không có blocker. Sẵn sàng manual QA.

**Đã đạt yêu cầu plan:**
- `OrderItemOptionsService` dùng chung cho cart checkout và direct order
- `POST /orders/direct` không đụng bảng cart
- Cả hai luồng persist qua `createFromSnapshots()`
- Unit tests: 14/14 PASS (`orders.service.direct.spec.ts`, `orders.service.spec.ts`, `carts.service.checkout.spec.ts`)

**Cải tiến ngoài plan (chấp nhận):**
- Pessimistic lock cart items khi checkout + test concurrent loser

**Góp ý không chặn merge (ghi nhận, xử lý sau nếu cần):**
- `CartsService.validateCartOption` vẫn duplicate một phần logic validate với `OrderItemOptionsService` (add/update cart) — có thể refactor dần
- `POST /orders` vẫn cho role CUSTOMER (legacy client-priced) — nên deprecate ở task riêng khi FE chuyển hết sang 2 endpoint mới
- Direct order chưa có field ghi chú đơn (`orders.note`); chỉ có ghi chú món — đúng với ví dụ trong plan, cần lưu ý khi làm FE Phase 2

---

## Out of Scope (Phase 1)

- Web / mobile frontend
- Payment gateway (VNPay, MoMo)
- Server-side shipping fee calculation
- Multi-item direct order in one request
- Cart TTL / cleanup

---

## Phase 2 (Deferred)

Frontend web integration: [`2026-08-11-direct-checkout-fe-web.md`](./2026-08-11-direct-checkout-fe-web.md)
