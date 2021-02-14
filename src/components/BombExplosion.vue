
<template>
    <div class="" v-bind:style="styleObject()"></div>
</template>

<script>
import bombermanTiles from '.././assets/super_bomberman_tiles.png';

export default {
    props: ['row', 'col'],    
    computed: {

    },
    data: function() {
        return {
            'width': 16,
            'height': 16,
            'bombExplodeRate': 50,
            'tickBackgroundInterval': null,
            'backgroundImage': bombermanTiles,
            'backgroundPositionPointer': 0,
            'backgroundPosition': null,
            'backgroundPositions': {
                'c': [
                    '-345px -512px',
                    '-362px -512px',
                    '-379px -512px',
                    '-396px -512px',
                    '-345px -529px'
                ],
                't': [
                    '-379px -495px',
                    '-396px -478px',
                    '-396px -495px',
                    '-362px -495px',
                    '-345px -495px'
                ],
                'tt': [
                    '-362px -529px',
                    '-379px -529px',
                    '-396px -529px',
                    '-311px -546px',
                    '-328px -546px'
                ],               
                'd': [
                    '-362px -546px',
                    '-379px -546px',
                    '-396px -546px',
                    '-345px -546px',
                    '-328px -495px'
                ],
                 'dd': [
                    '-362px -529px',
                    '-379px -529px',
                    '-396px -529px',
                    '-311px -546px',
                    '-328px -546px'
                ],     
                'l': [
                    '-345px -478px',
                    '-328px -478px',
                    '-311px -478px',
                    '-294px -478px',
                    '-277px -478px'
                ],
                'll': [
                    '-277px -512px',
                    '-277px -529px',
                    '-277px -546px',
                    '-311px -512px',
                    '-311px -529px'
                ],
                'r': [
                    '-294px -512px',
                    '-294px -529px',
                    '-294px -546px',
                    '-328px -512px',
                    '-328px -529px'
                ],
                 'rr': [
                    '-277px -512px',
                    '-277px -529px',
                    '-277px -546px',
                    '-311px -512px',
                    '-311px -529px'
                ],
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
            this.backgroundPosition = this.backgroundPositions[this.explosionType][this.backgroundPositionPointer];

            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;

            //animation end
            //destroy explsoion element itself
            if (this.backgroundPositionPointer >= this.backgroundPositions[this.explosionType].length) {                
                clearInterval(this.tickBackgroundInterval);

                this.$destroy();
                //// remove the element from the DOM
                this.$el.parentNode.removeChild(this.$el);
            }

        }
    },
    created: function() {
    },
    mounted: function () {        
        this.backgroundPosition = this.backgroundPositions[this.explosionType][this.backgroundPositionPointer];

        this.tickBackgroundInterval = setInterval(() => {
            this.changeBackground();
        }, this.bombExplodeRate);
    }
}
</script>