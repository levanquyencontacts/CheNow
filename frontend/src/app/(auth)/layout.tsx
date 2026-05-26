import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Box, Button, Link, Typography } from "@/components";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box className="relative min-h-screen overflow-hidden bg-[#f7eadf] text-[#544838]">
      <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(253,245,237,0.6)_0%,rgba(253,245,237,0.6)_31%,rgba(230,202,177,0.22)_31%,rgba(230,202,177,0.22)_63%,rgba(253,245,237,0.5)_63%),linear-gradient(0deg,rgba(249,237,226,0.92)_0%,rgba(249,237,226,0.92)_21%,transparent_21%)]" />
      <Box className="pointer-events-none absolute left-0 right-0 top-[74px] hidden h-[570px] bg-[linear-gradient(115deg,#5a3a25_0%,#6d4527_13%,#f9a52d_24%,#754a28_38%,#53351e_53%,#f7aa32_67%,#6d482c_82%,#f4a83a_100%)] opacity-95 lg:block" />

      <Box className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col">
        <Box
          className="flex h-[74px] items-center justify-between px-6 sm:px-12 lg:px-16"
          component="header"
        >
          <Link
            className="font-serif text-2xl font-semibold text-[#554d3e]"
            href="/"
            underline="none"
          >
            Sam Sam
          </Link>

          <Box className="flex items-center gap-7">
            <Box
              className="hidden items-center gap-7 text-sm font-medium text-[#675d50] sm:flex"
              component="nav"
            >
              <Link href="#" underline="none">
                Menu
              </Link>
              <Link href="#" underline="none">
                About Us
              </Link>
              <Link href="#" underline="none">
                Contact
              </Link>
            </Box>
            <Button className="h-10 px-5" size="small">
              Sign In
            </Button>
          </Box>
        </Box>

        <Box
          className="flex flex-1 items-center justify-center px-5 py-10 sm:px-12 lg:px-16 lg:py-14"
          component="main"
        >
          {children}
        </Box>

        <Box
          className="grid gap-10 px-6 py-12 text-[#605647] sm:grid-cols-2 sm:px-12 lg:grid-cols-4 lg:px-16 lg:py-14"
          component="footer"
        >
          <Box>
            <Typography className="font-serif" variant="h3">
              Sam Sam
            </Typography>
            <Typography className="mt-4 max-w-[230px] text-[#786f62]" variant="caption">
              Thưởng thức tinh hoa trà và chè Việt trong không gian thanh tịnh
              và ấm cúng.
            </Typography>
          </Box>
          <FooterLinks
            links={["Về Chúng Tôi", "Sustainability", "Brewing Guides"]}
            title="Thông tin"
          />
          <FooterLinks links={["Privacy Policy", "Terms of Service"]} title="Pháp lý" />
          <Box>
            <Typography className="font-semibold" variant="body2">
              Kết nối
            </Typography>
            <Box className="mt-4 flex items-center gap-5 text-[#80664e]">
              <ArrowUpRight className="h-4 w-4" />
              <Mail className="h-4 w-4" />
              <Phone className="h-4 w-4" />
            </Box>
            <Typography className="mt-8 text-[#786f62]" variant="caption">
              © 2024 Quán Chè. Crafted with Timeless Rituals.
            </Typography>
          </Box>
        </Box>
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
