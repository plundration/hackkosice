<script lang="ts">
    import type { PageData } from './$types';
    import Map from '$/components/PeopleMap.svelte';

    export let data: PageData;
</script>

{#if data.id}
    <Map id={data.id} />
{:else}
    <Map id="" />
{/if}
