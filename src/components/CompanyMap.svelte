<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import {
        create_map,
        node_distance,
        features,
        icon_sources,
    } from '$/lib/map';
    import InfoPane from '$/components/InfoPane.svelte';
    import Layout from '$/routes/+layout.svelte';

    // html element of the map
    let mapElement;
    // map object
    let map;

    onMount(async () => {
        if (!browser) return;

        var baseLayer = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            attribution: '...',
            maxZoom: 18
        }
        );

        var cfg = {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            // if scaleRadius is false it will be the constant radius used in pixels
            "radius": 0.01,
            "maxOpacity": .7,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": false,
            // which field name in your data represents the latitude - default "lat"
            latField: 'y',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'x',
            // which field name in your data represents the data value - default "value"
            valueField: 'value'
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
        
        let resp = await (await fetch("/firmy")).json();
        console.log(resp);
        let data = [];
        for (let y in resp) {
            for (let x in resp[y]) {
                console.log(y, x);
                data.push({x: 21.1 + x * 0.01, y: 48.5 + y * 0.01, value: resp[y][x]});
            }
        }
        heatmapLayer.setData({max: 10000, data: data});

    });

    onDestroy(async () => {
        if (map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });
    //<InfoPane data={placeData} />
</script>

<div class="map">
    <div class="main_map" bind:this={mapElement} />
    <div class="sidebar" />
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
