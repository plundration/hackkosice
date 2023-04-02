<script lang="ts">
    import { icon_sources, amenityTypes } from '$/lib/map';
    export let onSelect;
</script>

<div class="info-pane">
    <div class="list">
        {#each amenityTypes as type}
            <div class="listItem" on:click={() => {onSelect(type.file)}}>
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
</style>
