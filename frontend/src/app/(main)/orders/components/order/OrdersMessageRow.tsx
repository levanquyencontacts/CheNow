import { TableCell, TableRow } from "@/components";

export function OrdersMessageRow({
  danger = false,
  message,
}: {
  danger?: boolean;
  message: string;
}) {
  return (
    <TableRow>
      <TableCell
        className={[
          "px-4 py-8 text-center text-sm",
          danger ? "text-[#b12f1d]" : "text-[#6f665c]",
        ].join(" ")}
        colSpan={7}
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
