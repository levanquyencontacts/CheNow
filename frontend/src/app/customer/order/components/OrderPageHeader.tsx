import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type OrderPageHeaderProps = {
  href: string;
  label: string;
};

export function OrderPageHeader({ href, label }: OrderPageHeaderProps) {
  return (
    <header className="border-b border-[#eadfd4] bg-[#fffaf5]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-[#eadfd4] bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition-colors hover:border-primary hover:bg-emerald/10"
          href={href}
        >
          <ArrowLeft size={18} />
          {label}
        </Link>
      </div>
    </header>
  );
}
