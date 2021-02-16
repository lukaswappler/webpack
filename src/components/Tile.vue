
<template>
    <div class="tile" v-bind:style="styleObject()"></div>
</template>

<script>
import bombermanTiles from '.././assets/super_bomberman_tiles.png';

import Bomb from './Bomb.vue'
import BombExplosion from './BombExplosion.vue'
import PowerUp from './PowerUp.vue'

export default {
    props: ['col', 'row', 'isBorder', 'isBlock'],
    template: '<div v-bind:style="styleObject()"></div>',
    computed: {

    },
    data: function() {
        let isDestroyableBlock = false;
        
          //Erste 3 Felder freihalten, ansonsten  zufällig füllen        
        if (!this.isBorder && !this.isBlock &&
            !((this.row == 1 && this.col ==1) ||
            (this.row == 1 && this.col ==2) ||
            (this.row == 2 && this.col ==1))  &&
            Math.random() > 0.6) {
            isDestroyableBlock = true;
        }
        
        let destroyableBackground = '-311px -461px';
        let greenBackground = '-328px -461px'
        let blockBackground = '-294px -461px';
        let borderBackgroudn = '-294px -461px';
        let backgroundPosition;

        if (this.isBorder) {
            backgroundPosition = borderBackgroudn;
        } else if (this.isBlock) {
            backgroundPosition = blockBackground;
        } else if (isDestroyableBlock) {
            backgroundPosition = destroyableBackground;
        } else {
            backgroundPosition = greenBackground;
        }
        return {
            'isDestroyableBlock' : isDestroyableBlock,
            'backgroundImage': bombermanTiles,
            'backgroundPosition' : backgroundPosition,
            'borderBackgroudn' : borderBackgroudn,
            'blockBackground' : blockBackground,
            'greenBackground' : greenBackground,
            'destroyableBackground' : destroyableBackground,
            'wallBackgroundPositions': [
                '-277px -563px',
                '-294px -563px',
                '-311px -563px',
                '-328px -563px',
                '-345px -563px',
                '-362px -563px'                
            ],
        };
    },
    name: 'tile',
    methods: {
        styleObject: function () {
            const row = this.row;
            const col = this.col;

            const posLeft = col * 16;
            const posTop = row * 16;

           
            console.log('style');
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
                'background-position': this.backgroundPosition,                                
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
            let bombClass = Vue.extend(Bomb);
            let instance = new bombClass();

            instance.row = this.row;
            instance.col = this.col;
            instance.playground = this.$root;

            this.currentBomb = instance;

            instance.$mount();
            this.$el.appendChild(instance.$el);
            
        },
        addExplosion: function(explosionType) {
            //no explosion on solid things
            if (this.isBlock || this.isBorder) {
                return;
            }
            
            if (this.currentBomb && !this.currentBomb.isExploded) {
                console.log('double');
                this.currentBomb.explodeBomb();
            };
            

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

        addPowerUp: function() {
            console.log('addPowerUp')
            if (this.isAccessible()) {
                let powerUp = Vue.extend(PowerUp);
                let instance = new powerUp();
                
                instance.row = this.row;
                instance.col = this.col;
                instance.playground = this.$root;

                this.currentPowerUp = instance;

                instance.$mount();
                this.$el.appendChild(instance.$el);
            }
        },
        destroyTile: function() {

            if (this.isDestroyableBlock) {
                console.log("DESTROY");

                this.backgroundPositionWallPointer = 0;
                this.changeWallBreakBackground();

                this.destroyTileInterval = setInterval(() => {
                    this.changeWallBreakBackground();
                }, 200);
            }
        },

        changeWallBreakBackground: function() {             
            this.backgroundPosition = this.wallBackgroundPositions[this.backgroundPositionWallPointer];
            this.backgroundPositionWallPointer = this.backgroundPositionWallPointer + 1;

            //animation end
            if (this.backgroundPositionWallPointer > this.wallBackgroundPositions.length) {                
                clearInterval(this.destroyTileInterval);
                this.isDestroyableBlock = false;
                this.backgroundPosition = this.greenBackground;

                //todo trigger PowerUpCreation
                if(Math.random() > 0.5) {
                    this.addPowerUp();
                }
            }
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
        this.$on('dropBombEvent', this.addBomb);
        this.$on('bombExplosion', this.addExplosion);
    }
}
</script>