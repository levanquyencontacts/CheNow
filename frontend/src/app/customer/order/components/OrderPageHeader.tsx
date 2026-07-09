import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function OrderPageHeader() {
  return (
    <header className="border-b border-[#eadfd4] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link className="flex items-center gap-2 text-sm font-bold text-primary" href="/customer/menu">
          <ArrowLeft size={18} />
          Quay lại thực đơn
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d6a4f] text-sm font-black text-white">
            C
          </div>
          <span className="font-black text-[#432010]">CheNow</span>
        </div>
      </div>
    </header>
  );
}

