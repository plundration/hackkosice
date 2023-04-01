<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    onMount(async () => {
        const response = await fetch('/mapa/amenities', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                center: { lat: 48.705878, lng: 21.264437 },
                datasets: [{ name: 'zakladne_skoly', count: 3 }, { name: 'zastavky', count: 4 }, { name: 'materske_skoly', count: 2 }, { name: 'stredne_skoly', count: 2 }, { name: 'lekarne', count: 2 }, { name: 'psy', count: 2 }, { name: 'ambulancie', count: 2 }],
            }),
        });
        const data = await response.json();
        console.log(data);
    });
</script>
