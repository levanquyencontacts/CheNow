import type { Order as ApiOrder } from "@/services/types/apiType";
import type { CSSProperties, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { statusMeta } from "../../../../../common/utils/status";
import {
  formatCurrency,
  formatDateTime,
  formatOrderCode,
} from "../ultils/orderFormat";

const styles = {
  body: {
    color: "#183d2b",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 32,
  },
  box: {
    border: "1px solid #eadfd4",
    borderRadius: 8,
    padding: 14,
  },
  boxTitle: {
    fontSize: 13,
    margin: "0 0 8px",
    textTransform: "uppercase",
  },
  brand: {
    color: "#315d3b",
    fontSize: 14,
    fontWeight: 700,
    margin: "6px 0 0",
  },
  code: {
    color: "#5c554c",
    fontSize: 13,
    lineHeight: 1.7,
    textAlign: "right",
  },
  header: {
    alignItems: "flex-start",
    borderBottom: "2px solid #183d2b",
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  invoice: {
    boxSizing: "border-box",
    margin: "0 auto",
    maxWidth: 820,
  },
  line: {
    color: "#314032",
    fontSize: 13,
    lineHeight: 1.7,
    margin: 0,
  },
  note: {
    color: "#6f665c",
    fontSize: 12,
    margin: "28px 0 0",
    textAlign: "center",
  },
  productMeta: {
    color: "#6f665c",
    display: "block",
    marginTop: 4,
  },
  section: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "1fr 1fr",
    marginTop: 22,
  },
  summary: {
    marginLeft: "auto",
    marginTop: 20,
    maxWidth: 320,
  },
  summaryRow: {
    display: "flex",
    fontSize: 14,
    justifyContent: "space-between",
    padding: "7px 0",
  },
  table: {
    borderCollapse: "collapse",
    marginTop: 22,
    width: "100%",
  },
  tableCell: {
    borderBottom: "1px solid #eadfd4",
    fontSize: 13,
    padding: "12px 10px",
    verticalAlign: "top",
  },
  tableHead: {
    background: "#fff3e8",
    borderBottom: "1px solid #eadfd4",
    color: "#5c554c",
    fontSize: 12,
    padding: "12px 10px",
    textAlign: "left",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    letterSpacing: 1,
    margin: 0,
  },
  totalRow: {
    borderTop: "2px solid #183d2b",
    color: "#315d3b",
    display: "flex",
    fontSize: 18,
    fontWeight: 700,
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 12,
  },
} satisfies Record<string, CSSProperties>;

function DocumentShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body style={styles.body}>{children}</body>
    </html>
  );
}

function InvoiceHeader({ order }: { order: ApiOrder }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>HOA DON</h1>
        <p style={styles.brand}>Sam Sam Dessert</p>
      </div>
      <div style={styles.code}>
        <p style={{ margin: 0 }}>
          <strong>{formatOrderCode(order.id)}</strong>
        </p>
        <p style={{ margin: 0 }}>Ngay tao: {formatDateTime(order.createdAt)}</p>
        <p style={{ margin: 0 }}>
          Trang thai: {statusMeta[order.status].label}
        </p>
      </div>
    </div>
  );
}

function InvoiceInfoSection({ order }: { order: ApiOrder }) {
  return (
    <section style={styles.section}>
      <InfoBox title="Khach hang">
        <p style={styles.line}>
          Ten: {order.receiverName || `Customer #${order.userId}`}
        </p>
        <p style={styles.line}>Dien thoai: {order.receiverPhone || "-"}</p>
        <p style={styles.line}>Dia chi: {order.deliveryAddress || "-"}</p>
      </InfoBox>

      <InfoBox title="Thanh toan">
        <p style={styles.line}>
          Phuong thuc: {order.paymentMethod.toUpperCase()}
        </p>
        <p style={styles.line}>Trang thai: {order.paymentStatus}</p>
        <p style={styles.line}>Ghi chu: {order.note || "-"}</p>
      </InfoBox>
    </section>
  );
}

function InfoBox({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div style={styles.box}>
      <h2 style={styles.boxTitle}>{title}</h2>
      {children}
    </div>
  );
}

function InvoiceItemsTable({ order }: { order: ApiOrder }) {
  const items = order.orderItems ?? [];

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHead}>#</th>
          <th style={styles.tableHead}>San pham</th>
          <th style={styles.tableHead}>Don gia</th>
          <th style={styles.tableHead}>SL</th>
          <th style={styles.tableHead}>Thanh tien</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              style={{ ...styles.tableCell, textAlign: "center" }}
            >
              Khong co san pham.
            </td>
          </tr>
        ) : null}

        {items.map((item, index) => {
          const toppings =
            item.orderItemToppings
              ?.map(
                (topping) =>
                  `${topping.toppingName} x${topping.quantity} (${formatCurrency(
                    topping.price,
                  )})`,
              )
              .join(", ") || "-";

          return (
            <tr key={item.id}>
              <td style={styles.tableCell}>{index + 1}</td>
              <td style={styles.tableCell}>
                <strong>{item.productName}</strong>
                <span style={styles.productMeta}>Size {item.sizeName}</span>
                <small style={styles.productMeta}>{toppings}</small>
              </td>
              <td style={styles.tableCell}>{formatCurrency(item.price)}</td>
              <td style={styles.tableCell}>{item.quantity}</td>
              <td style={styles.tableCell}>{formatCurrency(item.subtotal)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function InvoiceSummary({ order }: { order: ApiOrder }) {
  return (
    <section style={styles.summary}>
      <SummaryRow
        label="Tam tinh"
        value={formatCurrency(order.subtotalAmount)}
      />
      <SummaryRow
        label="Giam gia"
        value={formatCurrency(-Number(order.discountAmount ?? 0))}
      />
      <SummaryRow
        label="Phi giao hang"
        value={formatCurrency(order.shippingFee)}
      />
      <div style={styles.totalRow}>
        <span>Tong cong</span>
        <strong>{formatCurrency(order.totalAmount)}</strong>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.summaryRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InvoiceDocument({ order }: { order: ApiOrder }) {
  return (
    <DocumentShell title={`Invoice ${formatOrderCode(order.id)}`}>
      <main style={styles.invoice}>
        <InvoiceHeader order={order} />
        <InvoiceInfoSection order={order} />
        <InvoiceItemsTable order={order} />
        <InvoiceSummary order={order} />
        <p style={styles.note}>Cam on quy khach.</p>
      </main>
    </DocumentShell>
  );
}

export const buildInvoiceHtml = (order: ApiOrder) =>
  `<!doctype html>${renderToStaticMarkup(<InvoiceDocument order={order} />)}`;

export const printInvoice = (order: ApiOrder) => {
  const printWindow = window.open("", "_blank", "width=900,height=720");

  if (!printWindow) {
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildInvoiceHtml(order));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
