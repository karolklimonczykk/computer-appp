import type { Metadata } from "next";
import "./global.css";
import MainHeader from "../components/mainheader";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Sklep Komputerowy 2025KK",
  description: "Sklep komputerowy stworzony przez Karol Klimończyk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <div id="page">
          <MainHeader />

          <main id="site-main">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
