export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja"><head><script async src="https://www.googletagmanager.com/gtag/js?id=G-71LHXQP189"></script><script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-71LHXQP189');`}} /></head>
            <body>{children}</body>
        </html>
    );
}
