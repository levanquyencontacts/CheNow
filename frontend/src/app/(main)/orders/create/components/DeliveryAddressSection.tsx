import { Box } from "@/components";
import { Field, Section } from "./FormPrimitives";
import { inputClass } from "./createOrderUtils";

export function DeliveryAddressSection({
  city,
  deliveryAddress,
  deliveryNote,
  district,
  setCity,
  setDeliveryAddress,
  setDeliveryNote,
  setDistrict,
  setWard,
  ward,
}: {
  city: string;
  deliveryAddress: string;
  deliveryNote: string;
  district: string;
  setCity: (value: string) => void;
  setDeliveryAddress: (value: string) => void;
  setDeliveryNote: (value: string) => void;
  setDistrict: (value: string) => void;
  setWard: (value: string) => void;
  ward: string;
}) {
  return (
    <Section title="2. Dia chi giao hang">
      <Box className="grid gap-3 md:grid-cols-3">
        <Field label="Tinh / Thanh pho">
          <select
            className={inputClass}
            onChange={(event) => setCity(event.target.value)}
            value={city}
          >
            <option value="Ha Noi">Ha Noi</option>
            <option value="TP. Ho Chi Minh">TP. Ho Chi Minh</option>
          </select>
        </Field>
        <Field label="Quan / Huyen">
          <select
            className={inputClass}
            onChange={(event) => setDistrict(event.target.value)}
            value={district}
          >
            <option value="Cau Giay">Cau Giay</option>
            <option value="Quan 1">Quan 1</option>
            <option value="Quan 3">Quan 3</option>
          </select>
        </Field>
        <Field label="Phuong / Xa">
          <select
            className={inputClass}
            onChange={(event) => setWard(event.target.value)}
            value={ward}
          >
            <option value="Dich Vong">Dich Vong</option>
            <option value="Ben Thanh">Ben Thanh</option>
            <option value="Vo Thi Sau">Vo Thi Sau</option>
          </select>
        </Field>
      </Box>
      <Box className="mt-4 grid gap-3">
        <Field label="Dia chi chi tiet">
          <input
            className={inputClass}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            value={deliveryAddress}
          />
        </Field>
        <Field label="Ghi chu giao hang">
          <input
            className={inputClass}
            onChange={(event) => setDeliveryNote(event.target.value)}
            value={deliveryNote}
          />
        </Field>
      </Box>
    </Section>
  );
}
