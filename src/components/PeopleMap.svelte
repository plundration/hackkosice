<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { create_map, node_distance, features, icons } from '$/lib/map';
    import InfoPane from '$/components/InfoPane.svelte';
    import { POST } from '$/routes/ludia/amenities/+server';

    // html element of the map
    let mapElement;
    // map object
    let map;
    // selected place marker
    let marker;
    // displayed amenities
    let amenities = [];

    // lat and lon can come from the URL, if provided
    export let selected_lat;
    export let selected_lon;

    onMount(async () => {
        if (!browser) return;

        // initialize map
        let map = create_map(L, mapElement, [48.72, 21.26]);

        // if there is a place in the URL, display it
        if (selected_lat && selected_lon) run();

        // display information about the selected point on the map
        async function run() {
            // remove all existing amenities
            for (let i in amenities) {
                amenities[i].remove();
            }
            amenities = [];
            map.panTo([selected_lat, selected_lon]);
            if (!marker) {
                marker = L.marker([selected_lat, selected_lon]).addTo(map);
            }
            marker.setLatLng([selected_lat, selected_lon]);

            let data = await (await fetch("/ludia/amenities", {method: "POST"})).json();
            for(let i in data) {
                let a = L.marker([data[i].lat, data[i].lon], {icon: L.icon(icons[data[i].type])}).addTo(map).bindPopup(data[i].name);
                amenities.push(a);
            }

            // let poly = await (await fetch("/ludia/isochrone", {method: "POST", body: JSON.stringify({})}))
        }

        // select point on click
        map.on('click', e => {
            selected_lat = e.latlng.lat;
            selected_lon = e.latlng.lng;
            run();
        });
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
