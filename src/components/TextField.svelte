<script lang="ts">
    type TextType = 'text' | 'password' | 'email';

    export let disabled: boolean = false;
    export let name: string;
    export let placeholder: string;
    export let value: string = '';
    export let type: TextType = 'text';
</script>

{#if type === 'email'}
    <input {placeholder} {name} {disabled} type="email" bind:value />
{:else if type === 'password'}
    <input {placeholder} {name} {disabled} type="password" bind:value />
{:else}
    <input {placeholder} {name} {disabled} type="text" bind:value />
{/if}

<style lang="scss">
    @import '../Settings.scss';

    input {
        padding: 0.5em 0.85em;
        font-weight: 500;

        color: $clr-light;
        background-color: $clr-dark-lighter;

        border-radius: 0.5em 0.5em 0 0;
        border: none;
        border-bottom: 2px solid $clr-light;

        transition: 0.05s;
    }

    input:focus {
        filter: brightness(1.28);

        border: none;
        border-bottom: 2px solid $clr-accent1;

        outline: none;
    }

    input:disabled {
        opacity: 0.6;
    }
</style>
