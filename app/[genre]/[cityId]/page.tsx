import cities from "@/data/cities.json";
import genresData from "@/data/genres.json";
import subsidyFacts from "@/data/subsidy-facts.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import { applicableOffers, isPlaceholderPage } from "@/lib/offers";

const genres: any = genresData;

const subsidyStatusLabel: Record<string, string> = {
    found: "実施中",
    closed: "予算上限に達し受付終了",
    not_found: "制度なし（公式確認済み）",
};

// ページごとの title / description を作る。
// これが無いと 338 ページすべてが layout.tsx の同じ文言を使ってしまい、
// 検索結果でどのページも同じ見出しになる（クリックされない・重複と判定される）。
export async function generateMetadata({
    params,
}: {
    params: Promise<{ genre: string; cityId: string }>;
}) {
    const { genre, cityId } = await params;
    const city = cities.find((c) => c.id === cityId);
    const data = genres[genre];

    if (!city || !data) return {};

    const cityFacts = (subsidyFacts.cities as Record<string, any>)[cityId];
    const fact = (genre === "battery" || genre === "solar") && cityFacts ? cityFacts[genre] : null;

    // 補助金の実データがある都市は、状況（実施中／終了など）まで書く。
    // 同じ雛形の説明文が並ばないよう、その都市固有の情報を先に出す。
    // 要約は長いので最初の一文だけを使う。
    const factLine = fact
        ? `補助金は${subsidyStatusLabel[fact.status]}。${fact.summary.split("。")[0]}。`
        : "";

    const rawDescription = `${city.name}（${city.pref}）の${data.name}。${factLine}${data.items
        .slice(0, 3)
        .join("・")}など${data.target}別に、${data.points.slice(0, 2).join("・")}のサービスを比較できます。`;

    // 検索結果で切られない長さに収める（全角120字が目安）
    const description =
        rawDescription.length > 120 ? `${rawDescription.slice(0, 119)}…` : rawDescription;

    const url = `/${genre}/${cityId}`;
    // 「${data.title}」を付けると同じ語が2回出て長くなるため、都道府県名を添える。
    // 「埼玉県 窓 補助金」のような検索にも当たるようにする狙い。
    const title = `${city.name}の${data.name}を比較｜${city.pref}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        // 提携先が無いページは検索対象から外す。リンクはたどらせたいので follow は残す。
        // data/genres.json に提携先を足せば自動的に検索対象へ戻る。
        robots: isPlaceholderPage(genre, city.pref)
            ? { index: false, follow: true }
            : undefined,
        openGraph: {
            title,
            description,
            url,
            type: "website",
            locale: "ja_JP",
        },
    };
}

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

    if (!city || !data) notFound();

    const otherGenres = Object.entries(genres).filter(([key]) => key !== genre) as [string, any][];
    const citiesInSamePref = cities.filter((c) => c.pref === city.pref && c.id !== city.id);

    const cityFacts = (subsidyFacts.cities as Record<string, any>)[cityId];
    const fact = (genre === "battery" || genre === "solar") && cityFacts ? cityFacts[genre] : null;

    const offers = applicableOffers(genre, city.pref);

    return (
        <main className="detail">
            <p className="breadcrumb">
                <Link href="/">トップへ戻る</Link>
            </p>

            <header className="detail-header" style={{ borderColor: data.color }}>
                <p className="area-label">
                    {city.pref} / {city.name}エリア
                </p>
                <h1>
                    {city.name}の{data.title}
                </h1>
            </header>

            <section className="offer-box" style={{ borderColor: data.color }}>
                <h2>{data.name}の対象{data.target}</h2>
                <div className="item-tags">
                    {data.items.map((item: string) => (
                        <span key={item}>{item}</span>
                    ))}
                </div>

                {offers.length > 0 ? (
                    <div className="offer-list">
                        {offers.map((offer: any) => (
                            <div className="offer" key={offer.label}>
                                <a href={offer.url} target="_blank" rel="nofollow noopener noreferrer">
                                    【公式】{offer.cta}
                                </a>
                                {offer.img && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={offer.img} width={1} height={1} alt="" style={{ position: "absolute" }} />
                                )}
                                <span className="offer-provider">{offer.label}</span>
                                {offer.note && <span className="offer-note">{offer.note}</span>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="pending">この地域・ジャンルの提携先は現在準備中です。近日公開予定ですので、しばらくお待ちください。</p>
                )}
            </section>

            {fact && (
                <section className="subsidy-fact" data-status={fact.status}>
                    <h2>
                        {city.name}の{genre === "battery" ? "蓄電池" : "太陽光発電"}補助金制度
                    </h2>
                    <p className="subsidy-fact-status">{subsidyStatusLabel[fact.status]}</p>
                    {fact.programName && <p className="subsidy-fact-name">{fact.programName}</p>}
                    <p className="subsidy-fact-summary">{fact.summary}</p>
                    {fact.period && <p className="subsidy-fact-period">{fact.period}</p>}
                    <p className="subsidy-fact-source">
                        出典：
                        <a href={fact.sourceUrl} target="_blank" rel="nofollow noopener noreferrer">
                            {fact.sourceLabel}
                        </a>
                        （{subsidyFacts.asOf}）
                    </p>
                </section>
            )}

            <section className="content-body">
                <p>
                    {city.name}（{city.pref}）で{data.name}をお探しの方向けに、対象となる{data.target}や、利用できる制度の概要をまとめています。
                </p>
                <p>
                    補助金は自治体ごとに予算や募集期間が異なり、年度の途中で受付が終了することがあります。実際の申請にあたっては、必ずお住まいの自治体の公式サイトや、上記の提携サービスから提供される最新情報をご確認ください。
                </p>
            </section>

            {citiesInSamePref.length > 0 && (
                <section className="nearby-cities">
                    <h2>{city.pref}の他の都市</h2>
                    <ul>
                        {citiesInSamePref.map((c) => (
                            <li key={c.id}>
                                <Link href={`/${genre}/${c.id}`}>{c.name}</Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="other-genres">
                <h2>{city.name}の他のジャンル</h2>
                <ul>
                    {otherGenres.map(([key, g]) => (
                        <li key={key}>
                            <Link href={`/${key}/${cityId}`}>{g.title}</Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
