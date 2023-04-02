<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import {
        create_map,
        node_distance,
        features,
        icon_sources,
    } from '$/lib/map';
    import CompanyPane from '$/components/CompanyPane.svelte';
    import Layout from '$/routes/+layout.svelte';

    // html element of the map
    let mapElement;
    // map object
    let map;

    let selected_amenity;
    let on_amenity_selected = amenity_type => {};

    let isochrone_polygons = [];

    onMount(async () => {
        if (!browser) return;

        var baseLayer = L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '...',
                maxZoom: 18,
            }
        );

        var cfg = {
            radius: 0.015,
            maxOpacity: 0.5,
            scaleRadius: true,
            useLocalExtrema: false,
            latField: 'y',
            lngField: 'x',
            valueField: 'value',
        };
        var heatmapLayer = new HeatmapOverlay(cfg);

        let map = leaflet.map(mapElement).setView([48.72, 21.26], 13);

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

        heatmapLayer.addTo(map);

        on_amenity_selected = async (amenity_type) => {
            selected_amenity = amenity_type;
        let resp = await (await fetch(`/firmy?name=${selected_amenity}`)).json();
        let data = [];
        for (let y in resp.heat) {
            for (let x in resp.heat[y]) {
                console.log(y, x);
                data.push({
                    x: 21.1 + x * 0.01,
                    y: 48.5 + y * 0.01,
                    value: resp.heat[y][x],
                });
            }
        }
        heatmapLayer.setData({ max: 10000, data: data });

        for (let i in isochrone_polygons) {
            isochrone_polygons[i].remove();
        }
        resp.isochrone.forEach(e => {
            let poly = L.polygon(e[0]).addTo(map);
            isochrone_polygons.push(poly);
        });

        };
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
        <CompanyPane onSelect={on_amenity_selected} />
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
