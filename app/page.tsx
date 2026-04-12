import Link from "next/link";
import genresData from "@/data/genres.json";

export default function Home() {
    const genres = Object.entries(genresData);
    return (
        <main style={{ padding: "40px" }}>
            <h1>暮らしの比較ポータル</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                {genres.map(([key, data]: [string, any]) => (
                    <Link
                        key={key}
                        href={`/${key}/nagoya`}
                        style={{ padding: "20px", border: "1px solid #ccc" }}
                    >
                        <h2>{data.title}</h2>
                        <p>{data.name}の地域別ページへ</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
