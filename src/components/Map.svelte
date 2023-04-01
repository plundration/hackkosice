<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { create_map, node_distance, features } from '$/map';
    import InfoPane from '$/components/InfoPane.svelte';

    let mapElement;
    let map;
    let placeData = null;

    export let selected_id;

    onMount(async () => {
        if (!browser) return;

        let center = [48.72, 21.26];
        let map = create_map(L, mapElement, center);

        let icons = {
            bussin: '/bussin.svg',
            skola: '/skola.svg',
            skolka: '/skolka.svg',
            spital: '/spital.svg',
            dom: '/dom.svg'
            pes: '/pes.svg',
            velky_dom: '/dom.svg',
            apatieka: '/apatieka.svg'
        };
        for (let i in icons) {
            icons[i] = {iconUrl: i, iconSize: [40, 40], iconAnchor: [20, 20]};
        }

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
