import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "暮らしの比較ポータル｜車・不動産・蓄電池をまとめて比較",
    description: "クルマの買取・不動産・蓄電池補助金など、暮らしに関わるさまざまな比較情報をジャンル横断でまとめたポータルサイトです。",
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
