<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let data = [];

    let sortBy = 'price';
    let reverse = false;

    function resort() {
        console.log(sortBy, reverse);
        data = data.sort((a, b) =>
            sortBy == 'price'
                ? reverse
                    ? b.cena - a.cena
                    : a.cena - b.cena
                : reverse
                ? (b.ulica > a.ulica) - (a.ulica > b.ulica)
                : (a.ulica > b.ulica) - (b.ulica > a.ulica)
        );
    }

    onMount(async function () {
        const request = await fetch('/mapa/byty');

        let d = await request.json();
        data = d.byty.sort((a, b) => a.cena - b.cena);
        resort();
    });
</script>

<div class="byty">
    <form>
        <select bind:value={sortBy} on:change={resort}>
            <option value="price">Podľa ceny</option>
            <option value="alpha">Podľa abecedy</option>
        </select>
        <select bind:value={reverse} on:change={resort}>
            <option value={false}>Vzostupne</option>
            <option value={true}>Zostupne</option>
        </select>
    </form>
    {#each data as byt}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="byt" on:click={() => goto('/mapa?id=' + byt.id)}>
            <img src="/byty/{(byt.id % 8) + 1}.jpg" alt="byt" />
            <div class="info">
                <div>{byt.ulica} - {byt.druh}</div>
                <div>{byt.cena}€ za {byt.plocha}m²</div>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    @import '../../Settings.scss';

    .byty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1em;

        width: 100%;
        height: 100%;

        padding: 4vh 2vw;

        .byt {
            max-width: 700px;
            width: 100%;
            height: 5em;
            border-radius: 4px;
            box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.08);

            display: flex;
            flex-direction: row;
            justify-content: left;

            transition: 0.2s;

            overflow: none;

            &:hover {
                scale: 1.04;
                cursor: pointer;
                box-shadow: 0 0 8px 3px rgba(0, 0, 0, 0.1);
                max-width: 720px;
            }

            img {
                border-radius: 4px 0 0 4px;
            }

            .info {
                padding: 0.8em;
            }
        }
    }
</style>
