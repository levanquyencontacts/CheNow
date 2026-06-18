import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components";
import type { Order as ApiOrder } from "@/services/types/apiType";
import type { CSSProperties, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { statusMeta } from "../../../../../common/utils/status";
import { formatCurrency, formatDateTime } from "../ultils/orderFormat";

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
    <Box style={styles.header}>
      <Box>
        <Box component="h1" style={styles.title}>
          HOA DON
        </Box>
        <Box component="p" style={styles.brand}>
          Sam Sam Dessert
        </Box>
      </Box>
      <Box style={styles.code}>
        <Box component="p" style={{ margin: 0 }}>
          <strong>{order.invoiceCode}</strong>
        </Box>
        <Box component="p" style={{ margin: 0 }}>
          Ngay tao: {formatDateTime(order.createdAt)}
        </Box>
        <Box component="p" style={{ margin: 0 }}>
          Trang thai: {statusMeta[order.status].label}
        </Box>
      </Box>
    </Box>
  );
}

function InvoiceInfoSection({ order }: { order: ApiOrder }) {
  return (
    <Box component="section" style={styles.section}>
      <InfoBox title="Khach hang">
        <Box component="p" style={styles.line}>
          Ten: {order.receiverName || `Customer #${order.userId}`}
        </Box>
        <Box component="p" style={styles.line}>
          Dien thoai: {order.receiverPhone || "-"}
        </Box>
        <Box component="p" style={styles.line}>
          Dia chi: {order.deliveryAddress || "-"}
        </Box>
      </InfoBox>

      <InfoBox title="Thanh toan">
        <Box component="p" style={styles.line}>
          Phuong thuc: {order.paymentMethod.toUpperCase()}
        </Box>
        <Box component="p" style={styles.line}>
          Trang thai: {order.paymentStatus}
        </Box>
        <Box component="p" style={styles.line}>
          Ghi chu: {order.note || "-"}
        </Box>
      </InfoBox>
    </Box>
  );
}

function InfoBox({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Box style={styles.box}>
      <Box component="h2" style={styles.boxTitle}>
        {title}
      </Box>
      {children}
    </Box>
  );
}

function InvoiceItemsTable({ order }: { order: ApiOrder }) {
  const items = order.orderItems ?? [];

  return (
    <Table style={styles.table}>
      <TableHead>
        <TableRow>
          <TableCell style={styles.tableHead}>#</TableCell>
          <TableCell style={styles.tableHead}>San pham</TableCell>
          <TableCell style={styles.tableHead}>Don gia</TableCell>
          <TableCell style={styles.tableHead}>SL</TableCell>
          <TableCell style={styles.tableHead}>Thanh tien</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              style={{ ...styles.tableCell, textAlign: "center" }}
            >
              Khong co san pham.
            </TableCell>
          </TableRow>
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
            <TableRow key={item.id}>
              <TableCell style={styles.tableCell}>{index + 1}</TableCell>
              <TableCell style={styles.tableCell}>
                <strong>{item.productName}</strong>
                <span style={styles.productMeta}>Size {item.sizeName}</span>
                <small style={styles.productMeta}>{toppings}</small>
              </TableCell>
              <TableCell style={styles.tableCell}>
                {formatCurrency(item.price)}
              </TableCell>
              <TableCell style={styles.tableCell}>{item.quantity}</TableCell>
              <TableCell style={styles.tableCell}>
                {formatCurrency(item.subtotal)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function InvoiceSummary({ order }: { order: ApiOrder }) {
  return (
    <Box component="section" style={styles.summary}>
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
      <Box style={styles.totalRow}>
        <span>Tong cong</span>
        <strong>{formatCurrency(order.totalAmount)}</strong>
      </Box>
    </Box>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Box style={styles.summaryRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </Box>
  );
}

function InvoiceDocument({ order }: { order: ApiOrder }) {
  return (
    <DocumentShell title={`Invoice ${order.invoiceCode}`}>
      <Box component="main" style={styles.invoice}>
        <InvoiceHeader order={order} />
        <InvoiceInfoSection order={order} />
        <InvoiceItemsTable order={order} />
        <InvoiceSummary order={order} />
        <Box component="p" style={styles.note}>
          Cam on quy khach.
        </Box>
      </Box>
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
