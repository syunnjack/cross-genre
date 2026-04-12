import cities from "@/data/cities.json";
import genresData from "@/data/genres.json";
import Link from "next/link";

const genres: any = genresData;

export async function generateStaticParams() {
    const paths = [];
    const genreKeys = Object.keys(genres);
    for (const genre of genreKeys) {
        for (const city of cities) {
            paths.push({ genre, cityId: city.id });
        }
    }
    return paths;
}

export default async function Page({
    params,
}: {
    params: Promise<{ genre: string; cityId: string }>;
}) {
    const { genre, cityId } = await params;
    const city = cities.find((c) => c.id === cityId);
    const data = genres[genre];

    if (!city || !data) return <div>404: ページが見つかりません</div>;

    return (
        <main style={{ padding: "20px" }}>
            <p>
                <Link href="/">トップへ戻る</Link>
            </p>
            <header>
                <p>
                    {city.pref}
                    {city.name}エリア
                </p>
                <h1>
                    {city.name}の{data.title}
                </h1>
            </header>

            <div
                style={{
                    margin: "20px 0",
                    padding: "20px",
                    border: "2px solid #333",
                }}
            >
                <h2>{data.name}無料診断スタート</h2>
                <p>対象：{data.target}</p>
                <select>
                    <option>--- 選択してください ---</option>
                    {data.items.map((item: string) => (
                        <option key={item}>{item}</option>
                    ))}
                </select>
                <div style={{ marginTop: "15px" }}>
                    <a
                        href={data.aspUrl}
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "blue",
                        }}
                    >
                        【公式】{data.cta}
                    </a>
                </div>
            </div>

            <p>
                {city.name}周辺で{data.name}
                をお探しの方に最新情報をお届けしています。
            </p>
        </main>
    );
}
