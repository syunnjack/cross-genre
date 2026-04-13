/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // 型エラーがあっても無視してビルドを完了させる
        ignoreBuildErrors: true,
    },
    eslint: {
        // ESLintのエラーも無視する
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
