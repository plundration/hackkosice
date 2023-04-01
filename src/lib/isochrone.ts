const apiUrl = 'http://localhost:8080/ors/v2/isochrones';

interface Point {
    x: number;
    y: number;
}

type IsochroneType = 'driving-car' | 'foot-walking' | 'cycling-regular';

export async function getIsochrone(point: Point, type: IsochroneType, time: number): Promise<Point[]> {
    const url = `${apiUrl}/${type}`;
    const request = { locations: [[point.y, point.x]], range: [time] };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8' },
        body: JSON.stringify(request)
    });

    const json = await response.json();

    console.log(json);
    console.log(json.features[0].geometry.coordinates);

    return json.features[0].geometry.coordinates;
}
