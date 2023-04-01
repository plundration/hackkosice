<script lang="ts">
    import type { PageData } from './$types';
    import Map from '$/components/PeopleMap.svelte';

    export let data: PageData;
</script>

{#if data.lon && data.lat}
    <Map selected_lat={data.lat}, selected_lon={data.lon} />
{:else}
    <Map selected_lat={null}, selected_lon={null} />
{/if}
