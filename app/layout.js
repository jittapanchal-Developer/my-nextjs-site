import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'Brûlé Café — Where Every Sip Tells a Story',
  description:
    'Experience Brûlé Café — a premium artisan café serving gourmet food, specialty coffee, and immersive AR dining. Visit us in the heart of the city.',
  keywords: 'café, coffee, artisan, gourmet, AR menu, augmented reality dining',
  openGraph: {
    title: 'Brûlé Café — AR-Ready Dining Experience',
    description: 'Premium artisan café with an immersive augmented reality menu.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
