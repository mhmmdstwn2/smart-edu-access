
import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
}

export function Layout({ children, hideFooter = false, hideHeader = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
