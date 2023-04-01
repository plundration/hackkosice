export function distance(lat1, lon1, lat2, lon2) {
    const R = 6378000;
    return Math.sqrt(((lon1 * Math.cos(lat1 / 180 * Math.PI) - lon2 * Math.cos(lat2 / 180 * Math.PI)) * R / 180 * Math.PI) ** 2 + ((lat1 - lat2) * R / 180 * Math.PI) ** 2);
}

export function is_in_polygon(point, polygon) {
    let count = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
        if (((polygon[i][0] > point[0] ? 1 : 0) ^ (polygon[i + 1][0] > point[0] ? 1 : 0)) &&
            point[1] > polygon[i][1] - (polygon[i][0] - point[0]) * (polygon[i][1] - polygon[i + 1][1]) / (polygon[i][0] - polygon[i + 1][0])
            ) {
            count++;
        }
    }
    console.log(count);
    return count % 2 != 0;
}