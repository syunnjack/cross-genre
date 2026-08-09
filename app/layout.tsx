import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "暮らしとビジネスの比較ポータル｜車・住宅補助金からビジネスツールまで",
    description: "中古車買取・不動産売却・蓄電池や太陽光発電などの住宅補助金から、ビジネスマッチングやサイネージ、クラウド電話などの事業者向けサービスまで、全国主要都市でまとめて比較できるポータルサイトです。",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja"><head>
  <meta name="google-site-verification" content="3ong__EaMNOGlOKlUdLEOYCRXWEkEwOVq0wwNnPf0YM" /><script async src="https://www.googletagmanager.com/gtag/js?id=G-71LHXQP189"></script><script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-71LHXQP189');`}} /></head>
            <body>{children}</body>
        </html>
    );
}
