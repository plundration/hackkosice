import { distance } from '$/lib/util';

export function create_map(leaflet, mapElement, center) {
    let map = leaflet.map(mapElement).setView(center, 13);

    leaflet
        .tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20,
            }
        )
        .addTo(map);

    return map;

}

export async function features(lat, lon) {
    const response = await fetch('/mapa/amenities', {
        method: 'POST',
        headers: {
            Accept: 'aplication/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            center: { lat: lat, lng: lon },
            datasets: [{ name: 'zakladne_skoly', count: 3 }, { name: 'stredne_skoly', count: 3 }, { name: 'materske_skoly', count: 2 }, { name: 'zastavky', count: 5 }]
        })
    });
    const data = await response.json();
    return data.datasets;
}

export function node_distance(lat, lon, item) {
    let coords = item.geometry.coordinates;
    let d = distance(lat, lon, coords[1], coords[0]);
    return Math.floor(d);
}

export let icon_sources = {
    supermarket: { fullName: 'Supermarket', iconUrl: '/amenity_icons/supermarket.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    restauracia: { fullName: 'Reštaurácia', iconUrl: '/amenity_icons/restauracia.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    zastavka: { fullName: 'Zastávka', iconUrl: '/amenity_icons/zastavka.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    kaviaren: { fullName: 'Kaviareň', iconUrl: '/amenity_icons/kaviaren.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    krcma: { fullName: 'Krčma', iconUrl: '/amenity_icons/krcma.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    ambulancia: { fullName: 'Ambulancia', iconUrl: '/amenity_icons/ambulancia.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    bar: { fullName: 'Bar', iconUrl: '/amenity_icons/bar.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    detska_ambulancia: { fullName: 'Detská ambulancia', iconUrl: '/amenity_icons/ambulancia.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    ihrisko: { fullName: 'Ihrisko', iconUrl: '/amenity_icons/ihrisko.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    drogeria: { fullName: 'Drogéria', iconUrl: '/amenity_icons/drogeria.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    fastfood: { fullName: 'Fastfood', iconUrl: '/amenity_icons/fastfood.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    gym: { fullName: 'Gym', iconUrl: '/amenity_icons/gym.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    lekaren: { fullName: 'Lekáreň', iconUrl: '/amenity_icons/lekaren.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    zubar: { fullName: 'Zubár', iconUrl: '/amenity_icons/zubar.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    posta: { fullName: 'Pošta', iconUrl: '/amenity_icons/posta.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    skolka: { fullName: 'Škôlka', iconUrl: '/amenity_icons/skolka.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    zakladna_skola: { fullName: 'Základná škola', iconUrl: '/amenity_icons/zakladna_skola.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    psi_vybeh: { fullName: 'Psí výbeh', iconUrl: '/amenity_icons/psi_vybeh.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
    balikobox: { fullName: 'Balíkobox', iconUrl: '/amenity_icons/posta.svg', iconSize: [40, 40], iconAnchor: [20, 20] },
};



