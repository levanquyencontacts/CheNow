"use client";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Box, Link, Typography } from "@/components";
import { useTranslation } from "react-i18next";

export function FooterPage() {
  const { t } = useTranslation();
  return (
    <Box
      className="grid gap-10 px-6 py-12 text-[#605647] sm:grid-cols-2 sm:px-12 lg:grid-cols-4 lg:px-16 lg:py-14"
      component="footer"
    >
      <Box>
        <Typography className="font-serif" variant="h3">
          Sam Sam
        </Typography>
        <Typography className="mt-4 max-w-57.5 text-[#786f62]" variant="caption">
        
        </Typography>
      </Box>
      <FooterLinks
        links={["Về Chúng Tôi", "Sustainability", "Brewing Guides"]}
        title={t("info")}
      />
      <FooterLinks links={["Privacy Policy", "Terms of Service"]} title="Pháp Lý" />
      <Box>
        <Typography className="font-semibold" variant="body2">
       {t("contact")}
        </Typography>
        <Box className="mt-4 flex items-center gap-5 text-[#80664e]">
          <ArrowUpRight className="h-4 w-4" />
          <Mail className="h-4 w-4" />
          <Phone className="h-4 w-4" />
        </Box>
        <Typography className="mt-8 text-[#786f62]" variant="caption">
        © 2026 Sam Sam. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <Box>
      <Typography className="font-semibold" variant="body2">
        {title}
      </Typography>
      <Box className="mt-4 flex flex-col gap-2 text-[#786f62]">
        {links.map((label) => (
          <Link className="text-xs" href="#" key={label} underline="none">
            {label}
          </Link>
        ))}
      </Box>
    </Box>
  );
}
