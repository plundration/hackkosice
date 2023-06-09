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

    type AmenityType = { name: string; file: string };
    const amenityTypes: AmenityType[] = [
        { name: 'Supermarket', file: 'supermarket' },
        { name: 'Ambulancia', file: 'ambulancia' },
        { name: 'Reštaurácia', file: 'restauracia' },
        { name: 'Základná škola', file: 'zakladna_skola' },
        { name: 'Škôlka', file: 'skolka' },
        { name: 'Ihrisko', file: 'ihrisko' },
        { name: 'Psí výbeh', file: 'psi_vybeh' },
        { name: 'Gym', file: 'gym' },
        { name: 'Kaviarňa', file: 'kaviaren' },
        { name: 'Krčma', file: 'krcma' },
        { name: 'Detská ambulancia', file: 'detska_ambulancia' },
        { name: 'Drogéria', file: 'drogeria' },
        { name: 'Lekáreň', file: 'lekaren' },
        { name: 'Zubár', file: 'zubar' },
        { name: 'Pošta', file: 'posta' },
        { name: 'Zastávka', file: 'zastavka' },
        { name: 'Balíkobox', file: 'balikobox' },
        { name: 'Fastfood', file: 'fastfood' },
        { name: 'Bar', file: 'bar' },
    ];
    
    let mapElement; // html element of the map
    let map; // map object
    let marker; // selected place marker
    let amenities = {}; // displayed amenities
    let polygons = []; // displayed isochrone polygon
    let amenityData = [];
    
    let hoveredAmenity: string | null = null;

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

        let data = await (await fetch("/mesto")).json();
        for (let i in data) {
            polygons.push(L.polygon(data[i][0]).addTo(map));
        }

        // display information about the selected point on the map
        async function run() {
            // remove all existing amenities
            for (let i in amenities) {
                amenities[i].remove();
            }
            amenities = {};
            map.panTo([selected_lat, selected_lon]);
            if (!marker) {
                marker = L.marker([selected_lat, selected_lon]).addTo(map);
            }
            marker.setLatLng([selected_lat, selected_lon]);
            
            let amenity_filter = 'po,zs,ms,ps';

            // fetch data about location
            let data = await (
                await fetch(`/ubytovanie?lat=${selected_lat}&lon=${selected_lon}&mode=${mode}`, {
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
                amenities[data.amenities[i].fileName] = a;
                // if the amenity is not in reach, add it to the list of far amenities
                if (!is_in_polygon([data.amenities[i].y, data.amenities[i].x], data.isochrone)) {
                    far.push(data.amenities[i]);
                }
            }
            
            console.log(amenities);

            for (let i in polygons) {
                polygons[i].remove();
            }
            // create new isochrone polygon
            polygons.push(L.polygon(data.isochrone).addTo(map));
            // L.polygon().addTo(map);


            setFootWalking = () => {
                mode = "foot-walking";
                run();
            };
            setBike = () => {
                mode = "cycling-regular";
                run();
            };
        }

        // function highlight_amenity(amenity_type) {
        //     let icon = amenities[amenity_type].getIcon();
        //     icon.iconSize = [100, 100];
        //     icon.iconAnchor = [50, 50];
        //     amenities[amenity_type].setIcon(icon);
        // }

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
            highlight_amenity('bar');
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
            <Button onClick={setFootWalking}>🚶‍♂️</Button>
            <Button onClick={setBike}>🚲</Button>
        </div>

        <div class="text_container" class:disabled={hoveredAmenity === null}>{amenityTypes.find(a => a.file === hoveredAmenity)?.name}</div>
    </div>
    <div class="sidebar">
        <InfoPane {amenityData} bind:hoveredAmenity />
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

    .button_container > :global(Button) {
        width: 3rem;
        height: 3rem;
        background-color: $clr-light;
        border: $clr-ludia 2px solid;
        padding: 0.3em;
    }
    
    .text_container {
        width: auto;
        height: auto !important;

        font-size: 1.75em;
        padding: 0.2em 0.4em;
        
        box-shadow: .0em .0em .20em .20em #0000000f;
        
        right: 1em;
        bottom: 1em;
        position: absolute;
        z-index: 10000;
        
        border-radius: 0.5em;
        background-color: $clr-light;
        
        &.disabled { display: none; }
    }
</style>
