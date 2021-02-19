
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

        let type = Math.random() > 0.50000 ? 'bomb' : 'power';

        return {
            'width': 16,
            'height': 16,
            'powerUpBlinkRate': 500,
            'type': type,
            'backgroundImage': bombermanPowerUp,
            'backgroundPositionPointer': 0,
            'backgroundPosition': '',
            'backgroundPositions': {
                'bomb': [
                    '-188px -32px',
                    '-188px -48px'
                ],
                'power': [
                    '-204px -32px',
                    '-204px -48px'
                ]
            }
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
            let backgroundPosis = this.backgroundPositions[this.type];
            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;
            this.backgroundPositionPointer = this.backgroundPositionPointer % backgroundPosis.length;

            this.backgroundPosition = backgroundPosis[this.backgroundPositionPointer];
        },
        removeIt: function () {
            clearInterval(this.tickBackgroundInterval);
            
            this.$destroy();
            //// remove the element from the DOM
            this.$el.parentNode.removeChild(this.$el);
        }                           
    },
    created: function() {
        console.log('powerUp created');
    },
    mounted: function () {        
        this.changeBackground();
        this.tickBackgroundInterval = setInterval(() => {
            this.changeBackground();
        }, this.powerUpBlinkRate);
    },
    
}
</script>