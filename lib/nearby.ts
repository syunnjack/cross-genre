import citiesData from "@/data/cities.json";

type City = { id: string; name: string; pref: string; lat: number; lng: number };

const cities = citiesData as City[];

/** 2地点の距離（km）。緯度経度から概算で出す */
function distanceKm(a: City, b: City): number {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
        Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * 近隣都市を返す。同じ都道府県の都市を先に並べ、足りない分を距離の近い順で埋める。
 *
 * 掲載している26都市のうち13都市は県内に他の掲載都市が無く、
 * 「県内の他の都市」の欄が丸ごと出ていなかった（札幌・仙台・那覇など）。
 * その結果、これらのページは他ページからも他ページへも導線が細くなっていた。
 */
export function nearbyCities(cityId: string, limit = 6): City[] {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return [];

    const samePref = cities.filter((c) => c.pref === city.pref && c.id !== city.id);
    const others = cities
        .filter((c) => c.pref !== city.pref)
        .sort((a, b) => distanceKm(city, a) - distanceKm(city, b));

    return [...samePref, ...others].slice(0, limit);
}
