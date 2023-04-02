<script lang="ts">
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
    import { listen } from 'svelte/internal';
    import {is_in_polygon} from '$/lib/util';
    import Button from '$/components/Button.svelte';
    
    let mapElement; // html element of the map
    let map; // map object
    let marker; // selected place marker
    let amenities = []; // displayed amenities
    let polygon; // displayed isochrone polygon
    let amenityData = [];

    // lat and lon can come from the URL, if provided
    export let selected_lat;
    export let selected_lon;

    let setBike = () => {};
    let setFootWalking = () => {};

    let mode = "foot-walking";

    onMount(async () => {
        if (!browser) return;

        // initialize map
        let map = create_map(L, mapElement, [48.72, 21.26]);

        // initialize icons
        let icons = {};
        for (let i in icon_sources) {
            icons[i] = L.icon(icon_sources[i]);
        }

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
            
            let amenity_filter = 'po,zs,ms,ps';

            // fetch data about location
            let data = await (
                await fetch(`/ludia?lat=${selected_lat}&lon=${selected_lon}`, {
                    method: 'GET',
                })
            ).json();

            // list of amenities that are far away
            let far = [];
            
            amenityData = data.amenities;
            
            // parse all amenities
            for (let i in data.amenities) {
                // create a marker
                let a = L.marker([data.amenities[i].y, data.amenities[i].x], {
                    icon: icons[data.amenities[i].fileName]
                        ? icons[data.amenities[i].fileName]
                        : icons.error,
                })
                    .addTo(map)
                    .bindPopup(data.amenities[i].name);
                // add marker to list
                amenities.push(a);
                // if the amenity is not in reach, add it to the list of far amenities
                if (!is_in_polygon([data.amenities[i].y, data.amenities[i].x], data.isochrone)) {
                    far.push(data.amenities[i]);
                }
            }

            console.log(far);

            // reset isochrone polygon
            if (polygon) polygon.remove();
            // create new isochrone polygon
            polygon = L.polygon(data.isochrone).addTo(map);

            setFootWalking = () => {
                mode = "foot-walking";
                run();
            };
            setBike = () => {
                mode = "cycling-regular";
                run();
            };
        }

        // select point on click
        map.on('click', e => {
            if (
                e.latlng.lat < 48.65 ||
                e.latlng.lng > 21.35 ||
                e.latlng.lat > 48.77 ||
                e.latlng.lng < 21.17
            ) {
                alert('Mapa funguje iba v oblasti košíc!');
                return;
            }
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

    
</script>

<div class="map">
    <div class="main_map">
        <div bind:this={mapElement} />
        <div class="button_container">
            <Button onClick={setFootWalking}>𓏎</Button>
            <Button onClick={setBike}>🚲</Button>
        </div>
    </div>
    <div class="sidebar">
        <InfoPane {amenityData}/>
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

    .map div:not(.sidebar, .sidebar *, .button_container),
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

    .main_map {
        position: relative;
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

    .button_container {
        right: 1rem;
        top: 1rem;
        position: absolute;
        z-index: 10000;
    }

    .button_container > Button {
        width: 3rem;
        height: 3rem;
    }
</style>
