<script lang="ts">
    import type { PageData } from './$types';
    import PeopleMap from '$/components/PeopleMap.svelte';

    export let data: PageData;
</script>

{#if data.lon && data.lat}
    <PeopleMap selected_lat={data.lat}, selected_lon={data.lon} />
{:else}
    <PeopleMap selected_lat={null}, selected_lon={null} />
{/if}
