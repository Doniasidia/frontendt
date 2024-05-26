import { Inter, Libre_Franklin, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const libre_franklin = Libre_Franklin({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-libre_franklin",
});