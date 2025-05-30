import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavbarWrapper from '@/components/layout/NavbarWrapper';
import Footer from '@/components/layout/Footer';
import MotionLayout from '@/components/MotionLayout';
import SidebarWrapper from '@/components/layout/SidebarWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyBodyRules - Sağlıklı Yaşam Takip Uygulaması',
  description:
    'Sağlıklı yaşam ve fitness hedeflerinize ulaşmanıza yardımcı olan kişisel sağlık takip uygulaması.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Navbar sadece korumasız sayfalarda client-side olarak gösterilecek */}
          <NavbarWrapper />
          <div className="flex flex-1">
            {/* Sidebar sadece korumalı sayfalarda gösterilecek */}
            <SidebarWrapper />
            <div className="flex-1">
              <MotionLayout>{children}</MotionLayout>
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
