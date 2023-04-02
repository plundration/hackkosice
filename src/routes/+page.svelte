<script lang="ts">
    import Button from '$/components/Button.svelte';
    import { goto } from '$app/navigation';
</script>

<div class="full-page">
    <div class="main-page-top">
        <div class="overlay">
            <div class="top-content">
                <h1>15-minútové Košice</h1>
                <div class="main-page-button">
                    <Button onClick={() => goto('/ubytovanie')}>Pre ľudí</Button>
                    <Button onClick={() => goto('/podnikanie')}>Pre firmy</Button>
                </div>
            </div>
        </div>
    </div>

    <div class="main-page-bottom">
        <div class="bottom-text">
            Pomocou voľne dostupných dát pomáhame
            <div id="bottom-text-split">
                <p id="ludia">
                    Ľuďom nájsť <b>vhodné ubytovanie</b> na základe
                    <b>možností dopravy, vzdialenosti škôl, lekární, ambulancií a viac.</b>
                </p>
                <p id="firmy">
                    Firmám nájsť <b>nevyužité miesto</b>, kde ich daná služba chýba alebo nie je dostatočne prístupná.
                </p>
            </div>
            týmto košice dostávame bližšie ku skutočnému <b>15-minútovému mestu</b>.
        </div>
    </div>
</div>

<style lang="scss">
    @import '../Settings.scss';

    .full-page {
        width: 100%;
        min-height: calc(100vh - $header-height);

        display: flex;
        flex-direction: column;
    }

    .main-page-top {
        flex-grow: 1.6;

        background-image: url('/kosice.jpg');
        background-position: center;
        background-size: cover;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .overlay {
            width: 100%;
            height: 100%;
            background-color: #00000084;
            backdrop-filter: blur(3px);

            flex-grow: 1;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .top-content {
            width: 100%;
            height: 100%;

            flex-grow: 1;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 2em;

            h1 {
                font-size: 3em;
                padding: 0.2em 0.4em;
                margin: 0 1.2em;
                background-color: #ffffffd0;

                border-radius: 0.05em;
                text-align: center;
            }

            .main-page-button {
                font-size: 1.5em;
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 0.8em;
            }
        }
    }

    .main-page-bottom {
        flex-grow: 1;

        display: flex;
        justify-content: center;
        align-items: center;

        .bottom-text {
            font-size: 1.3em;
            max-width: 700px;
            margin: 1em;
            text-align: center;
        }
    }
    
    #bottom-text-split {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
        gap: 0.5em;

        margin: 1.5em 0;
        
        p {
            padding: 1.0em;
            border-radius: 0.5em;
            color: $clr-light;
        }
        
        #ludia { background-color: $clr-ludia; }
        #firmy { background-color: $clr-firmy; }
        
    }
</style>
