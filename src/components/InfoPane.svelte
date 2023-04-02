<script lang="ts">
    export let amenityData;
</script>

<div class="info-pane">
    {#if amenityData.length > 0}
        <div class="grid">
            {#each amenityData as amenity}
                <div class={amenity.time < 5 ? 'green' : amenity.time < 10 ? 'yellow' : 'red'}>
                    <img src={'amenity_icons/' + amenity.fileName + '.svg'} />
                    <p>{amenity.time} min</p>
                </div>
            {/each}
        </div>
    {:else}
        <h1>Kliknite na mapu</h1>
        <p>
            Práve vidíte časti mesta, z ktorých sa za <b>15 minút</b> viete
            <b>pešo</b>
            dostať ku <b>všetkým denným potrebám a službám</b>
        </p>
        <p>Tieto potreby sú:</p>
        <ul>
            <li>Vzdelanie</li>
            <li>Zdravotná starostlivosť</li>
            <li>Lekárne</li>
            <li>Prístup k obchodom</li>
            <li>Zeleň</li>
            <li>Ihriská</li>
        </ul>
    {/if}
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

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5em, 1fr));
        gap: 10px;

        & > * {
            padding: 0.3em;
            border-radius: 0.8em;
            border: var(--border-clr) solid 0.5em;

            img {
                width: 100%;
                height: auto;
            }
        }
    }
</style>
