<script lang="ts">
    import type { LayoutData, PageData } from './$types';

    import NavLink from '$/components/NavLink.svelte';
    import Header from '$/components/Header.svelte';
    import Burger from '$/components/Burger.svelte';

    export const prerender = true;
    export let data: LayoutData;

    let links = [
        { name: 'Domov', href: '/' },
        { name: 'Ubytovanie', href: '/ubytovanie' },
        { name: 'Podnikanie', href: '/podnikanie' },
    ];
</script>

<div id="app">
    <Header {links} />

    <main>
        <div class="page-container">
            <slot />
        </div>
    </main>
</div>

<style type="scss">
    @import '../Settings.scss';

    :global {
        a {
            color: $clr-accent2;
            display: inline-block;
            transition: 0.2s ease;
            text-decoration: none;

            &:visited,
            &:hover,
            &:active {
                color: currentColor;
            }

            &:hover {
                opacity: 0.9;
                scale: 1.07;
            }
        }
    }

    :root {
        background-color: $clr-light;
        color: $clr-dark;
        font-family: $ff-primary;
        font-size: max(min(2.8vw, 15px), 12px);
    }

    #app {
        width: 100%;
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        font-size: 1.3rem;
    }

    main {
        flex-grow: 1;

        display: flex;
        justify-content: center;
    }

    .page-container {
        width: 100%;
    }
</style>
