import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata = {
  title: "The Doctor's Orders",
  description: 'A directory of soft places on Earth through time and space.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="bg-slate-950 text-slate-50 font-sans antialiased overflow-hidden selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
