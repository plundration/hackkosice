<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { create_map, node_distance, features } from '$/map';
    import InfoPane from '$/components/InfoPane.svelte';

    let mapElement;
    let map;
    let placeData = null;

    export let id;

    onMount(async () => {
        if (!browser) return;

        let center = [48.72, 21.26];
        let map = create_map(L, mapElement, center);

        var bussin = L.icon({
            iconUrl: '/bussin.svg',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        var skola = L.icon({
            iconUrl: '/skola.svg',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        var skolka = L.icon({
            iconUrl: '/skolka.svg',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        var spital = L.icon({
            iconUrl: '/spital.svg',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        var dom = L.icon({
            iconUrl: '/dom.svg',
            iconSize: [52, 52],
            iconAnchor: [26, 26],
            className: 'dom',
        });

        var pes = L.icon({
            iconUrl: '/pes.svg',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        var velky_dom = L.icon({
            iconUrl: '/dom.svg',
            iconSize: [52, 52],
            iconAnchor: [26, 26],
        });
        var apatieka = L.icon({
            iconUrl: '/apatieka.svg',

            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        let markers = [];

        let isoch;

        async function update_isoch(id) {
            const response = await fetch('/mapa/byty/isochrone', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
            const data = await response.json();
            if (isoch) { isoch.remove(); }
            console.log(data);
            isoch = L.polygon(data.isochrone).addTo(map);
        }

        /*
        async function update_isoch(lat, lon) {
            const response = await fetch('/mapa/isochrone', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lat: lat,
                    lon: lon,
                    time: 600,
                    transportation: 'driving',
                }),
            });
            const data = await response.json();
            if (izoch) {
                izoch.remove();
            }
            console.log(data);
            izoch = L.polygon(data.outline).addTo(map);
        }
        */

        var point;

        async function update_data(lat, lon, extra_data) {
            let data = await (
                await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=sk`
                )
            ).json();
            map.flyTo([lat, lon], 15, {
                animate: true,
                duration: 0.5,
            });
            let name = data.display_name;
            let [first, ...second] = name.split('-');
            second = second.join('-');
            if (point) {
                point.remove();
            }
            point = L.marker([lat, lon], { icon: velky_dom }).addTo(map);

            let veci = await features(lat, lon);
            console.log(veci);

            for (let i in markers) {
                markers[i].remove();
            }

            veci.zakladne_skoly.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: skola }
                    )
                        .addTo(map)
                        .bindPopup(`<h3>${i.properties.organizacia_nazov}</h3>`)
                );
            });
            veci.stredne_skoly.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: skola }
                    )
                        .addTo(map)
                        .bindPopup(`<h3>${i.properties.organizacia_nazov}</h3>`)
                );
            });
            veci.materske_skoly.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: skolka }
                    )
                        .addTo(map)
                        .bindPopup(`<h3>${i.properties.organizacia_nazov}</h3>`)
                );
            });
            veci.zastavky.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: bussin }
                    )
                        .addTo(map)
                        .bindPopup(
                            `<h3> ${i.properties.zastavka_nazov}</h3> Zastávka`
                        )
                );
            });
            veci.psy.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: pes }
                    )
                        .addTo(map)
                        .bindPopup(`<h3>psíčkarska zóna</h3>`)
                );
            });
            veci.lekarne.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: apatieka }
                    )
                        .addTo(map)
                        .bindPopup(`<h3>${i.properties.nazov}</h3>`)
                );
            });
            veci.ambulancie.forEach(i => {
                markers.push(
                    L.marker(
                        [i.geometry.coordinates[1], i.geometry.coordinates[0]],
                        { icon: spital }
                    )
                        .addTo(map)
                        .bindPopup(`<h3>${i.properties.nazov_zariadenia}</h3>`)
                );
            });

            let d_zs = node_distance(lat, lon, veci.zakladne_skoly[0]);
            let d_ss = node_distance(lat, lon, veci.stredne_skoly[0]);
            let d_ms = node_distance(lat, lon, veci.materske_skoly[0]);
            let d_z = node_distance(lat, lon, veci.zastavky[0]);
            let d_p = node_distance(lat, lon, veci.psy[0]);
            let d_l = node_distance(lat, lon, veci.lekarne[0]);
            let d_a = node_distance(lat, lon, veci.ambulancie[0]);

            console.log(extra_data);

            placeData = {
                name1: `${extra_data.druh}, ${extra_data.ulica}`,
                name2: `${extra_data.cena}€ - ${extra_data.plocha}m²`,
                name3: second,
                properties: [
                    (async () => {
                        return {
                            key: 'Najbližšia základná škola',
                            value: `${d_zs}m - ${veci.zakladne_skoly[0].properties.organizacia_nazov}`,
                            color:
                                d_zs < 300
                                    ? 'green'
                                    : d_zs < 700
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                    (async () => {
                        return {
                            key: 'Najbližšia stredná škola',
                            value: `${d_ss}m - ${veci.stredne_skoly[0].properties.organizacia_nazov}`,
                            color:
                                d_ss < 700
                                    ? 'green'
                                    : d_ss < 1000
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                    (async () => {
                        return {
                            key: 'Najbližšia materkská škola',
                            value: `${d_ms}m - ${veci.materske_skoly[0].properties.organizacia_nazov}`,
                            color:
                                d_ms < 250
                                    ? 'green'
                                    : d_ms < 500
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                    (async () => {
                        return {
                            key: 'Najbližšia zastávka MHD',
                            value: `${d_z}m - ${veci.zastavky[0].properties.zastavka_nazov}`,
                            color:
                                d_z < 200
                                    ? 'green'
                                    : d_z < 500
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                    (async () => {
                        return {
                            key: 'Najbližšie zariadenie pre psíčkarov',
                            value: `${d_p}m`,
                            color:
                                d_p < 200
                                    ? 'green'
                                    : d_p < 500
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                    (async () => {
                        return {
                            key: 'Najbližšia lekáreň',
                            value: `${d_l}m - ${veci.lekarne[0].properties.nazov}`,
                            color:
                                d_l < 400
                                    ? 'green'
                                    : d_l < 800
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                    (async () => {
                        return {
                            key: 'Najbližšia ambulancia',
                            value: `${d_a}m - ${veci.ambulancie[0].properties.nazov_zariadenia}`,
                            color:
                                d_a < 300
                                    ? 'green'
                                    : d_a < 600
                                    ? 'yellow'
                                    : 'red',
                        };
                    })(),
                ],
            };

            update_isoch(extra_data.id);
        }

        async function get_places() {
            let request = await fetch('/mapa/byty');
            let places = await request.json();
            let byty = places.byty;
            byty.forEach(i => {
                let marker = L.marker([i.lat, i.lng], { icon: dom }).addTo(map);
                marker.on('click', async e => {
                    await update_data(e.latlng.lat, e.latlng.lng, i);
                });
            });

            if (id != '') {
                for (let i = 0; i < byty.length; i++) {
                    if (byty[i].id == id) {
                        await update_data(byty[i].lat, byty[i].lng, byty[i]);
                        break;
                    }
                }
            }
        }

        get_places();
    });

    onDestroy(async () => {
        if (map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });
</script>

<div class="map">
    <div class="main_map" bind:this={mapElement} />
    <div class="sidebar">
        <InfoPane data={placeData} />
    </div>
</div>

<style lang="scss">
    @import '../Settings.scss';
    @import 'leaflet/dist/leaflet.css';

    @media screen and (min-width: 600px) {
        .map {
            height: calc(100vh - $header-height) !important;
        }
    }

    .map div:not(.sidebar, .sidebar *),
    .map {
        height: 100%;
    }

    .map {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .map .main_map {
        flex-grow: 1;
    }

    :global {
        .map {
            .dom {
                opacity: 75%;
                filter: brightness(80%);
                padding: 9px !important;
                transition: padding 0.2s linear, opacity 0.2s linear,
                    filter 0.2s linear !important;
            }

            .dom:hover {
                opacity: 100%;
                filter: none;
                padding: 0 !important;
            }
        }
    }

    .sidebar {
        width: min(100vw, 20em);
        // height: calc(100% - $header-height);
        height: 100%;
        z-index: 10000;
        box-shadow: 0 0 3em rgba(0, 0, 0, 0.2);
        background-color: white;
        padding: 0;
        overflow: scroll;
    }

    @media screen and (max-width: 600px) {
        .map {
            flex-direction: column;
        }
        .sidebar {
            top: calc($header-height + 100vh - 12em);
            left: 0;
            width: 100%;
            border-radius: 1em 1em 0 0;
            height: 100%;
        }
    }
</style>
