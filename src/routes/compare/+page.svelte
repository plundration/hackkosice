<script>
    import Map from '$/components/Map.svelte';
</script>

<div class='split'>
    <Map />
    <Map />
</div>

<style>
    .split {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    .split > * {
        width: 50%;
    }
</style>