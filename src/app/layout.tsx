import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Toaster } from 'react-hot-toast';
import { PageTransition } from '@/components/animations/PageTransition';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: 'ORBIT | Futuristic AI E-Commerce',
    template: '%s | ORBIT',
  },
  description: 'Experience the future of shopping with AI-powered recommendations, 3D product previews, and AR try-on features.',
  keywords: ['ecommerce', 'AI', '3D shopping', 'AR try-on', 'futuristic', 'marketplace'],
  authors: [{ name: 'ORBIT Team' }],
  creator: 'ORBIT',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ORBIT | Futuristic AI E-Commerce',
    description: 'Experience the future of shopping with AI-powered recommendations, 3D product previews, and AR try-on features.',
    siteName: 'ORBIT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORBIT | Futuristic AI E-Commerce',
    description: 'Experience the future of shopping with AI-powered recommendations.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-dark-400 font-sans antialiased overflow-x-hidden">
        <Providers>
          {/* Custom cursor */}
          <CustomCursor />
          
          {/* Toast notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(30, 30, 46, 0.9)',
                color: '#fff',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#00d4ff',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Background gradient */}
          <div className="fixed inset-0 bg-mesh-gradient pointer-events-none opacity-50" />
          <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />
          
          {/* Navigation */}
          <Navbar />
          
          {/* Main content with page transitions */}
          <main className="relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          
          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
