
<template>
    <div class="" v-bind:style="styleObject()"></div>
</template>

<script>
import bombermanPlayers from '.././assets/super_bomberman_players.png';
import bombermanTiles from '.././assets/super_bomberman_tiles.png';

export default {
    props: ['row', 'col'],    
    computed: {

    },
    data: function() {
        return {
            'width': 16,
            'height': 16,
            'bombRadius': 3,
            'bombTickRate': 200,
            'bombExplodeRate': 100,
            'bombExplosionTimer': 2000,
            'tickBackgroundInterval': null,
            'exploadeBackgroundInterval': null,            
            'backgroundImage': bombermanTiles,
            'backgroundPositionPointer': 0,
            'backgroundPosition': '-379px -563px',
            'backgroundPositions': [
                '-379px -563px',
                '-396px -563px',
                '-413px -563px',
                '-396px -563px',
            ],
            'backgroundExplodePositions': [
                '-345px -512px',
                '-362px -512px',
                '-379px -512px',
                '-396px -512px',
                '-345px -529px'
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
            console.log('changeBackground');

            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;
            this.backgroundPositionPointer = this.backgroundPositionPointer % this.backgroundPositions.length;

            this.backgroundPosition = this.backgroundPositions[this.backgroundPositionPointer];
        },
        changeExplodeBackground: function() {
            this.backgroundPosition = this.backgroundExplodePositions[this.backgroundPositionPointer];

            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;
            //this.backgroundPositionPointer = this.backgroundPositionPointer % this.backgroundExplodePositions.length;





            //animation end
            //destroy bomb itself
            if (this.backgroundPositionPointer >= this.backgroundExplodePositions.length) {
                clearInterval(this.exploadeBackgroundInterval);

                this.$destroy();

                //// remove the element from the DOM
                this.$el.parentNode.removeChild(this.$el);


                //trigger explosions in radius
                console.log('row', this.row);
                console.log('col', this.col);

                console.log(this);


            }

        }
    },
    created: function() {
        console.log('bomb created');
    },
    mounted: function () {
        console.log('bomb mounted');

        console.log('row', this.row);
        console.log('col', this.col);

        this.tickBackgroundInterval = setInterval(() => {
            this.changeBackground();
        }, this.bombTickRate);

        setTimeout(function() {
            //stop ticker background
            clearInterval(this.tickBackgroundInterval);

            this.backgroundPositionPointer = 0;

            //trigger explosion
            if (this.playground) {

                for (var i = 1; i <= this.bombRadius; i++) {
                    let tiles = this.playground.$children[0].$children;

                    let center = tiles.filter(child => child.row === this.row  && child.col ===this.col)[0];
                    //console.log(this.playground.$children[0].$children)
                    //let center = this.playground.$children[0].$children.filter(child => true)[10];
                    
                    //console.log(center);
                    //console.log('XX: ', i);

                    let top = tiles.filter(child => child.row === this.row - i && child.col ===this.col)[0];
                    let down = tiles.filter(child => child.row === this.row + i && child.col ===this.col)[0];
                    let left = tiles.filter(child => child.row === this.row && child.col ===this.col - i)[0];
                    let right = tiles.filter(child => child.row === this.row && child.col ===this.col + i)[0];
                    /*
                    console.log(this.playground);
                    console.log(this.playground.$children[0].$options);
                    console.log(this.playground.$children[0].$options._componentTag);
                    console.log(left);
                    */
                    center.$emit('bombExplosion','c');
                    if (top) {
                        top.$emit('bombExplosion',  (i === this.bombRadius ? 't' : 'tt'));
                    }

                    if (down) {
                        down.$emit('bombExplosion',  (i === this.bombRadius ? 'd' : 'dd'));
                    }

                    if (left) {
                        left.$emit('bombExplosion',  (i === this.bombRadius ? 'l' : 'll'));
                    }
                    if (right) {
                        right.$emit('bombExplosion',  (i === this.bombRadius ? 'r' : 'rr'));
                    }
                }

                this.$destroy();

                //// remove the element from the DOM
                this.$el.parentNode.removeChild(this.$el);
            }

            //explode
            /*
            this.exploadeBackgroundInterval = setInterval(() => {
                this.changeExplodeBackground();
            }, this.bombExplodeRate);
            */

        }.bind(this), this.bombExplosionTimer);

    }
}
</script>