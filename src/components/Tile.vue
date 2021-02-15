
<template>
    <div class="tile" v-bind:style="styleObject()"></div>
</template>

<script>
import bombermanTiles from '.././assets/super_bomberman_tiles.png';

import Bomb from './Bomb.vue'
import BombExplosion from './BombExplosion.vue'

export default {
    props: ['col', 'row', 'isBorder', 'isBlock'],
    template: '<div v-bind:style="styleObject()"></div>',
    computed: {

    },
    data: function() {
        let isDestroyableBlock = false;
        
          //Erste 3 Felder freihalten, ansonsten  zufällig füllen        
        if (!((this.row == 1 && this.col ==1) ||
            (this.row == 1 && this.col ==2) ||
            (this.row == 2 && this.col ==1))  &&
            Math.random() > 0.6) {
            isDestroyableBlock = true;
        }

        return {
            'isDestroyableBlock' : isDestroyableBlock,
            'backgroundImage': bombermanTiles,
        };
    },
    name: 'tile',
    methods: {
        styleObject: function () {
            const row = this.row;
            const col = this.col;

            const posLeft = col * 16;
            const posTop = row * 16;

            let backgroundPosition;
            if (this.isBorder) {
                backgroundPosition = '-294px -461px';
            } else if (this.isBlock) {
                backgroundPosition = '-294px -461px';
            } else if (this.isDestroyableBlock) {
                backgroundPosition = '-311px -461px';
            } else {
                backgroundPosition = '-328px -461px';
            }

            return {

                'image-rendering': 'optimizeSpeed',
                'image-rendering': '-moz-crisp-edges',
                'image-rendering': '-o-crisp-edges',
                'image-rendering': '-webkit-optimize-contrast',
                'image-rendering': 'pixelated',
                'image-rendering': 'optimize-contrast',
                '-ms-interpolation-mode': 'nearest-neighbor',
                
                'z-index': 100,
                position: 'absolute',
                'background-image':  'url(\'' + this.backgroundImage + '\')',                
                'background-position': backgroundPosition,                                
                //background: 'url(\'super_bomberman_tiles.png\')  -277px -461px',
                //background: 'url(\'super_bomberman_tiles.png\')  -294px -461px',
                //background: background ,
                height: 16,
                width: 16,
                'top': posTop,
                'left': posLeft
            }
        },
        addBomb: function() {
            console.log('addBomb');
            console.log(this.$el);


            console.log(123);
            console.log(Bomb);
            console.log(456);
            let bombClass = Vue.extend(Bomb);
            let instance = new bombClass();

            instance.row = this.row;
            instance.col = this.col;
            instance.playground = this.$root;

            console.log('pre mount');
            console.log(instance);
            
            console.log('after mount');

            //instance.$mount() // pass nothing
            //this.$refs.container.appendChild(instance.$el)

            instance.$mount();
            this.$el.appendChild(instance.$el);
            
        },
        addExplosion: function(explosionType) {

            //no explosion on solid things
            if (this.isBlock || this.isBorder) {
                return;
            }

            console.log('addExplosion');

            let boom = Vue.extend(BombExplosion);
            let instance = new boom();

            instance.explosionType = explosionType;
            instance.row = this.row;
            instance.col = this.col;
            instance.playground = this.$root;

            this.currentBombExplosion = instance;


            instance.$mount();
            this.$el.appendChild(instance.$el);
        },
        isExplosionPossible: function() {
            return !this.isBorder && !this.isBlock && !this.isDestroyableBlock;
        },

        isAccessible: function() {
            return !this.isBorder && !this.isBlock && !this.isDestroyableBlock;
        },
        isExploding: function() {
            if (this.currentBombExplosion && this.currentBombExplosion.isActive) {
                return true;
            }
            return false;
        }

    },
    created: function() {
        console.log('tile created');      
    },
    mounted: function () {

        
        

        console.log('tile mounted');
        this.$on('dropBombEvent', this.addBomb);
        
        
        this.$on('bombExplosion', this.addExplosion);

    }
}
</script>