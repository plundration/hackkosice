import { distance } from '$/util';

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
            datasets: [{ name: 'zakladne_skoly', count: 3 }, { name: 'stredne_skoly', count: 3 }, { name: 'materske_skoly', count: 2 }, { name: 'zastavky', count: 5 }, {name: 'lekarne', count: 3}, {name: 'psy', count: 3}, {name: 'ambulancie', count: 2}]
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