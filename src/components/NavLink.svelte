<script lang="ts">
    import { page } from '$app/stores';
    export let href: string;
    export let className: string = '';
</script>

<a href={href} class:active={$page.url.pathname === href} class={className} on:click>
    <slot />
</a>