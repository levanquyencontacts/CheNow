export function OrdersMessageRow({
  danger = false,
  message,
}: {
  danger?: boolean;
  message: string;
}) {
  return (
    <tr>
      <td
        className={[
          "px-4 py-8 text-center text-sm",
          danger ? "text-[#b12f1d]" : "text-[#6f665c]",
        ].join(" ")}
        colSpan={7}
      >
        {message}
      </td>
    </tr>
  );
}
