<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { create_map, node_distance, features } from '$/lib/map';
    import InfoPane from '$/components/InfoPane.svelte';

    // html element of the map
    let mapElement;
    // map object
    let map;
    
    // lat and lon from URL
    export let selected_lat;
    export let selected_lon;

    onMount(async () => {
        if (!browser) return;

        let center = [48.72, 21.26];
        let map = create_map(L, mapElement, center);

        console.log(selected_lat, selected_lon);
        if (selected_lat && selected_lon) {
            map.panTo([parseFloat(selected_lat), parseFloat(selected_lon)]);
        }
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
    <div class="sidebar">
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
