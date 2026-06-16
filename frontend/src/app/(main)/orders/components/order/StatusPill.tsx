import type { OrderStatus } from "@/services/types/apiType";

import { statusMeta } from "../../../../../common/utils/status";

export function StatusPill({
  meta,
}: {
  meta: (typeof statusMeta)[OrderStatus];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}
