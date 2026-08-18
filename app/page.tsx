import Link from "next/link";
import genresData from "@/data/genres.json";
import cities from "@/data/cities.json";

// canonical はページごとに指定する。layout.tsx に置くと下層ページにも
// そのまま継承され、全ページが同じ URL を正規と申告してしまう。
export const metadata = {
    alternates: { canonical: "/" },
};

const genreDescriptions: Record<string, string> = {
    kuruma: "愛車の買取相場を複数社まとめて比較できます。",
    fudousan: "マンション・戸建て・土地の売却相場をまとめて確認できます。",
    battery: "家庭用蓄電池の導入にかかる自治体・国の補助金情報をまとめました。",
    solar: "太陽光発電の設置費用と補助金をまとめて比較できます。",
    ev: "電気自動車・PHVの購入時に使えるCEV補助金など対象車種をまとめました。",
    v2h: "電気自動車を家庭用電源として使うV2H設備の補助金情報です。",
    window: "窓の断熱リフォームで使える補助金・工事内容をまとめました。",
    waterheater: "エコキュートなど省エネ給湯器の補助金情報をまとめました。",
    gaiheki: "外壁塗装リフォームの業者比較・見積もり情報をまとめました。",
    business: "外注先探しや販路開拓に使えるビジネスマッチングサービスをまとめました。",
    signage: "店舗集客やイベント演出に使えるデジタルサイネージをまとめました。",
    telephony: "スマホで内線・外線ができるクラウド電話サービスをまとめました。",
    inbound: "訪日外国人客の受け入れ体制を強化するインバウンド対策をまとめました。",
};

const personalGenres = ["kuruma", "fudousan", "battery", "solar", "ev", "v2h", "window", "waterheater", "gaiheki"];
const businessGenres = ["business", "signage", "telephony", "inbound"];

const SITE_URL = "https://kurabe-kurashi.jp";
const SITE_NAME = "暮らしとビジネスの比較ポータル";
const SITE_DESCRIPTION =
    "中古車買取・不動産売却・蓄電池や太陽光発電などの住宅補助金から、ビジネスマッチングやサイネージ、クラウド電話などの事業者向けサービスまで、全国主要都市でまとめて比較できるポータルサイトです。";

// 検索エンジンとAIにサイトの素性を渡す。JSON.stringifyはXSSを除去しないため、
// Next.jsの推奨どおり "<" をユニコード表記に置き換えてから埋め込む。
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            inLanguage: "ja",
            publisher: { "@id": `${SITE_URL}/#organization` },
        },
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
        },
    ],
};

const sampleCities = [
    { id: "tokyo23", name: "東京23区" },
    { id: "osaka", name: "大阪市" },
    { id: "nagoya", name: "名古屋市" },
    { id: "fukuoka", name: "福岡市" },
];

function GenreGrid({ keys, genresData }: { keys: string[]; genresData: Record<string, any> }) {
    return (
        <section className="genre-grid" aria-label="ジャンル一覧">
            {keys.map((key) => {
                const data = genresData[key];
                if (!data) return null;
                return (
                    <article className="genre-card" key={key} style={{ borderTopColor: data.color }}>
                        <h2>{data.title}</h2>
                        <p>{genreDescriptions[key]}</p>
                        <div className="genre-card-cities">
                            {sampleCities.map((city) => (
                                <Link href={`/${key}/${city.id}`} key={city.id}>{city.name}</Link>
                            ))}
                        </div>
                    </article>
                );
            })}
        </section>
    );
}

export default function Home() {
    const genresMap = genresData as Record<string, any>;
    const regions = Array.from(new Set(cities.map((c) => c.pref)));
    const firstGenreKey = Object.keys(genresMap)[0];

    return (
        <main className="home">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <header className="hero">
                <p className="eyebrow">暮らしとビジネスの比較ポータル</p>
                <h1>車・住宅補助金からビジネスツールまで、まとめて比較</h1>
                <p className="lead">
                    全国{cities.length}都市に対応。中古車買取・不動産売却・蓄電池や太陽光発電などの住宅補助金といった個人向け情報から、ビジネスマッチングやサイネージ、クラウド電話などの事業者向けサービスまで、ジャンル横断でまとめています。
                </p>
            </header>

            <h2 className="section-title">個人・ご家庭向け</h2>
            <GenreGrid keys={personalGenres} genresData={genresMap} />

            <h2 className="section-title">事業者向け</h2>
            <GenreGrid keys={businessGenres} genresData={genresMap} />

            <section className="city-index" aria-label="都市から探す">
                <h2>都市から探す</h2>
                {regions.map((pref) => (
                    <div className="region-block" key={pref}>
                        <h3>{pref}</h3>
                        <ul>
                            {cities
                                .filter((c) => c.pref === pref)
                                .map((c) => (
                                    <li key={c.id}>
                                        <Link href={`/${firstGenreKey}/${c.id}`}>{c.name}</Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </section>
        </main>
    );
}
