<script lang="ts">
    import { onMount } from 'svelte';
    import { Hamburger } from 'svelte-hamburgers';

    import NavLink from './NavLink.svelte';

    export let links: { name: string; href: string }[];
    let open: boolean | undefined = false;

    function toggleMenu() {
        open = !open;
    }

    onMount(() => {
        window.addEventListener('keydown', () => {
            open = false;
        });
    });
</script>

<Hamburger bind:open type="squeeze" --color="white" --padding="0" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="burger-overlay" class:active={open} on:click={toggleMenu} />

<div class="burger-menu" class:open>
    <div class="burger-menu-container">
        <img src="/logo.svg" alt="logo" class="logo" />
        <div class="burger-links">
            {#each links as link}
                <NavLink
                    on:click={toggleMenu}
                    className="burger-link"
                    href={link.href}
                >
                    {link.name}
                </NavLink>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @import '../Settings.scss';

    $transition-time: 0.3s;

    .burger-overlay {
        width: 0;
        height: 100vh;

        top: 0;
        left: 0;

        position: absolute;
        z-index: 11000;

        background-color: #00000050;
        opacity: 0;

        transition: opacity $transition-time, width 0s $transition-time;

        &.active {
            transition: opacity $transition-time, width 0s 0s;
            opacity: 1;
            width: 100vw;
        }
    }

    .burger-menu {
        $width: Min(65vw, 400px);
        width: $width;
        height: 100vh;
        position: absolute;

        font-size: 3em;

        top: 0;
        left: calc(-1 * $width);
        z-index: 12000;
        background-color: $clr-accent1;

        transition: $transition-time ease;

        &.open {
            transform: translateX($width);
        }
    }

    .logo {
        padding: 0.2em;
        width: min(100%, 70px);
        height: auto;
        border-radius: 3px;
        background-color: white;
        margin: 0.5em 0.2em;
    }

    :global {
        .burger-menu-container {
            padding: 3vh 5vw;

            .burger-links {
                display: flex;
                flex-direction: column;

                .burger-link {
                    width: fit-content;

                    color: $clr-light;

                    &.active {
                        padding: 0.02em 0.3em;
                        border-radius: 0.1em;
                        color: $clr-accent1;
                        background-color: $clr-light;
                    }
                }
            }
        }
    }
</style>
