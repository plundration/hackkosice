<script lang="ts">
    import { icon_sources } from '$/lib/map';
    export let onSelect;

    export const amenityTypes = [
        { name: 'Supermarket', file: 'supermarket' },
        { name: 'Reštaurácia', file: 'restauracia' },
        { name: 'Kaviareň', file: 'kaviaren' },
        { name: 'Krčma', file: 'krcma' },
        { name: 'Ambulancia', file: 'ambulancia' },
        { name: 'Bar', file: 'bar' },
        { name: 'Detská ambulancia', file: 'detska_ambulancia' },
        { name: 'Ihrisko', file: 'ihrisko' },
        { name: 'Drogéria', file: 'drogeria' },
        { name: 'Gym', file: 'gym' },
        { name: 'Lekáreň', file: 'lekaren' },
        { name: 'Zubár', file: 'zubar' },
        { name: 'Pošta', file: 'posta' },
        { name: 'Škôlka', file: 'skolka' },
        { name: 'Základná škola', file: 'zakladna_skola' },
        { name: 'Psí výbeh', file: 'psi_vybeh' },
        { name: 'Balíkobox', file: 'balikobox' },
    ];
</script>

<div class="info-pane">
    <div style="padding-bottom: 1em">
        <h2>Chcete nájsť optimálnu lokalitu na podnikanie v Košiciach?</h2>
        <p style="padding: 1em 0"> S nami dokážete optimalizovať <b>dopyt</b> o vaše služby. </p>
        <p> Mapa zobrazuje miesta s najväčším predpokladaným dopytom, vybrané podľa časovej dostupnosti obyvateľstva a jeho hustoty. </p>
    </div>
    <div class="list">
        {#each amenityTypes as type}
            <div
                class="listItem"
                on:click={() => {
                    onSelect(type.file);
                }}
            >
                <img src={icon_sources[type.file].iconUrl} />
                <span>{type.name}</span>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    @import '../Settings.scss';
    @import 'leaflet/dist/leaflet.css';

    .info-pane {
        padding: 1em;
        margin: 0;
    }

    .info-pane h1 {
        line-height: 1em;
        padding: 0 0 1em 0;
    }
    .info-pane h2 {
        line-height: 1em;
        padding: 0 0 0.5em 0;
    }

    .property {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 1em 0.5em 1em 0.5em;
        border-radius: 1em;
        overflow: hidden;
        box-shadow: 1em #00000080;
    }

    .red {
        --border-clr: hsl(0, 70%, 60%);
    }

    .yellow {
        --border-clr: hsl(60, 80%, 60%);
    }

    .green {
        --border-clr: hsl(120, 70%, 60%);
    }

    .property-key {
        width: 50%;
        text-align: center;
        padding: 0.75em 0.5em 0.75em 0.5em;
        background-color: #00000010;
        display: flex;
        align-items: center;
    }

    .property-value {
        width: 50%;
        text-align: center;
        padding: 0.75em 0.5em 0.75em 0.5em;
        display: flex;
        align-items: center;
    }

    .listItem {
        height: 4em;
        display: flex;
        flex-direction: row;
        padding: 0.3em;
        border-radius: 10px;
    }

    .listItem:hover {
        background-color: #eeeeee;
    }

    .listItem > span {
        flex-grow: 1;
        display: flex;
        align-items: center;
        padding-left: 1em;
    }

    p {
        line-height: 1.2;
    }
</style>
