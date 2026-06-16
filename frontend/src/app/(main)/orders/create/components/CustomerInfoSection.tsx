import { Box } from "@/components";
import { UserRound } from "lucide-react";
import { Field, Section } from "./FormPrimitives";
import { inputClass } from "./createOrderUtils";

export function CustomerInfoSection({
  receiverEmail,
  receiverName,
  receiverPhone,
  setReceiverEmail,
  setReceiverName,
  setReceiverPhone,
}: {
  receiverEmail: string;
  receiverName: string;
  receiverPhone: string;
  setReceiverEmail: (value: string) => void;
  setReceiverName: (value: string) => void;
  setReceiverPhone: (value: string) => void;
}) {
  return (
    <Section title="1. Thong tin khach hang">
      <Box className="mb-4 flex gap-5 text-sm font-semibold text-[#314032]">
        <label className="flex items-center gap-2">
          <input
            className="h-4 w-4 accent-[#183d2b]"
            defaultChecked
            name="customerMode"
            type="radio"
          />
          Khach hang cu
        </label>
        <label className="flex items-center gap-2">
          <input
            className="h-4 w-4 accent-[#183d2b]"
            name="customerMode"
            type="radio"
          />
          Khach hang moi
        </label>
      </Box>
      <Box className="grid gap-3">
        <Field label="Ten khach hang">
          <input
            className={inputClass}
            onChange={(event) => setReceiverName(event.target.value)}
            value={receiverName}
          />
        </Field>
        <Box className="grid gap-3 sm:grid-cols-2">
          <Field label="So dien thoai">
            <input
              className={inputClass}
              onChange={(event) => setReceiverPhone(event.target.value)}
              value={receiverPhone}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              onChange={(event) => setReceiverEmail(event.target.value)}
              value={receiverEmail}
            />
          </Field>
        </Box>
        <Box className="flex items-center gap-3 rounded-md border border-[#eadfd4] bg-[#fffaf5] p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eadfd4] text-[#6b5a49]">
            <UserRound aria-hidden="true" className="h-6 w-6" />
          </span>
          <Box className="text-sm">
            <p className="font-bold text-[#183d2b]">
              {receiverName || "Chua chon khach"}
            </p>
            <p className="text-[#314032]">{receiverPhone || "-"}</p>
            <p className="text-[#6f665c]">{receiverEmail || "-"}</p>
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
