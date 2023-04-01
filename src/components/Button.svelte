<script lang="ts">
    export let onClick: () => void = () => {};
    export let disabled: boolean = false;
</script>

<button on:click={onClick} {disabled}>
    <slot />
</button>

<style lang="scss">
    @import '../Settings.scss';
    
    button {
        padding: 0.3em 0.55em;
        font-weight: 700;
        
        color: white;
        background-color: $clr-accent1;

        border: none;
        border-radius: 0.2em;
        
        box-shadow: .0em .0em .18em .18em #00000009;
        
        transition: 0.05s;
    }
    
    button:enabled:hover {
        transform: scale(1.05);
        filter: brightness(1.08);
        cursor: pointer;
    }
    
    button:disabled {
        opacity: 0.6;
    }
</style>