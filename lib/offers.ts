import genresData from "@/data/genres.json";

const genres: any = genresData;

/**
 * その都市で実際に出せる提携先（広告リンク）を返す。
 * offer.prefectures が指定されている場合は、その都道府県でのみ出す。
 */
export function applicableOffers(genre: string, pref: string): any[] {
    const data = genres[genre];
    if (!data) return [];
    return ((data.offers ?? []) as any[]).filter(
        (offer) => !offer.prefectures || offer.prefectures.includes(pref)
    );
}

/**
 * 提携先が1つも無いページは「準備中」と表示されるだけで、読者にとっても
 * 検索エンジンにとっても価値が無い。こうしたページを検索対象に残すと、
 * サイト全体の評価を下げて、提携先のあるページの順位まで巻き添えにする。
 *
 * そのため noindex を付け、sitemap からも外す。提携先を data/genres.json に
 * 追加すれば、この判定が自動的に false になり検索対象へ戻る。
 */
export function isPlaceholderPage(genre: string, pref: string): boolean {
    return applicableOffers(genre, pref).length === 0;
}
