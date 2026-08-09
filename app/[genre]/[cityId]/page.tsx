import cities from "@/data/cities.json";
import genresData from "@/data/genres.json";
import subsidyFacts from "@/data/subsidy-facts.json";
import Link from "next/link";
import { notFound } from "next/navigation";

const genres: any = genresData;

const subsidyStatusLabel: Record<string, string> = {
    found: "実施中",
    closed: "予算上限に達し受付終了",
    not_found: "制度なし（公式確認済み）",
};

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

    const applicableOffers = ((data.offers ?? []) as any[]).filter(
        (offer) => !offer.prefectures || offer.prefectures.includes(city.pref)
    );

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

                {applicableOffers.length > 0 ? (
                    <div className="offer-list">
                        {applicableOffers.map((offer: any) => (
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
