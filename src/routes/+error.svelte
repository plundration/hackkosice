<script>
    import { page } from "$app/stores";
</script>

<div class='error-page'> 
    <h1>{$page.status}</h1>
    <p>{$page?.error?.message}</p>
</div>

<style lang='scss'>
    .error-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 3em; 
    }
</style>
