
<template>
    <div class="" v-bind:style="styleObject()"></div>
</template>

<script>
import bombermanTiles from '.././assets/super_bomberman_tiles.png';
import bombermanPowerUp from '.././assets/powerup.gif';

export default {
    props: ['row', 'col'],    
    computed: {

    },
    data: function() {
        return {
            'width': 16,
            'height': 16,
            'powerUpBlinkRate': 500,
            'backgroundImage': bombermanPowerUp,
            'backgroundPositionPointer': 0,
            'backgroundPosition': '-188px -32px',
            'backgroundPositions': [
                '-188px -32px',
                '-188px -48px'
            ]
        }
    },
    methods: {
        styleObject: function () {

            return {        
                'background-image':  'url(\'' + this.backgroundImage + '\')',                
                'background-position': this.backgroundPosition,
                height: this.height,
                width: this.width
            }
        },
        changeBackground: function() {
            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;
            this.backgroundPositionPointer = this.backgroundPositionPointer % this.backgroundPositions.length;

            this.backgroundPosition = this.backgroundPositions[this.backgroundPositionPointer];
        }                      
    },
    created: function() {
        console.log('powerUp created');
    },
    mounted: function () {
        
        this.tickBackgroundInterval = setInterval(() => {
            this.changeBackground();
        }, this.powerUpBlinkRate);

    },
    
}
</script>