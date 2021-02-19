
<template>
    <div class="player" v-bind:style="styleObject()"></div>
</template>

<script>
import bombermanPlayers from '.././assets/super_bomberman_players.png';

import Bomb from './Bomb.vue'

export default {
    data: function() {
        return {
            'top': 6,
            'left': 16,
            
            'currentBombCount': 0,
            'maxBombs': 1,
            'bombRadius': 1,
            
            'backgroundChangeFrequency': 8,
            'backgroundImage': bombermanPlayers,
            'backgroundPosition': '-106px -46px',
            'lastMove': null,
            'lastMoveCount': 0,
            'last' : {
                'right' : null,
                'left' : null,
                'top' : null,
                'down' : null,
            },
            'backgroundPositions': {
                right: [
                    '-106px -46px',
                    '-122px -46px',
                    '-138px -46px'
                ],
                left: [
                    '-3px -43px',
                    '-19px -43px',
                    '-36px -43px'
                ],
                down: [
                    '-56px -46px',
                    '-71px -46px',
                    '-87px -46px'
                ],
                up: [
                    '-56px -20px',
                    '-73px -20px',
                    '-89px -20px'
                ],
                death: [
                    '-30px -74px',
                    '-49px -76px',
                    '-66px -76px',
                    '-83px -76px',
                    '-100px -76px',
                    '-118px -76px',
                ]
            }
        };
    },

    methods: {
        styleObject: function () {
            return {
                'image-rendering': 'optimizeSpeed',
                'image-rendering': '-moz-crisp-edges',
                'image-rendering': '-o-crisp-edges',
                'image-rendering': '-webkit-optimize-contrast',
                'image-rendering': 'pixelated',
                'image-rendering': 'optimize-contrast',
                '-ms-interpolation-mode': 'nearest-neighbor',

                position: 'absolute',
                'background-image':  'url(\'' + this.backgroundImage + '\')',
                'background-position': this.backgroundPosition,
                height: 26,
                width: 16,
                'z-index': 10000,
                'top': this.top,
                'left': this.left
            };
        },
        changeBackground: function(direction) {
            let backgroundPosition = this.backgroundPositions[direction];

            if (this.lastMove === direction) {
                this.lastMoveCount++;
                //change img only after a number of moves
                if (this.lastMoveCount > this.backgroundChangeFrequency) {
                    this.lastMoveCount = 0;
                    this.last[direction]++;

                    this.last[direction] = this.last[direction] % backgroundPosition.length;
                    this.backgroundPosition = backgroundPosition[this.last[direction]];
                }

            } else {
                this.last[direction] = 0;
                this.backgroundPosition = backgroundPosition[0];
            }

            this.lastMove = direction;
        },        
        getCurrentCells: function() {
            let playerRow1 = Math.floor((this.top - 6 + 16 ) / 16) ;
            let playerRow2 = Math.floor((this.top - 6 + 15 + 16) / 16) ;
            let colPosition1 = (this.left) - 15;
            let colPosition2 = (this.left);
            let playerCol1 = Math.ceil((colPosition1) / 16);
            let playerCol2 = Math.ceil(((colPosition2) ) / 16);

            let tiles = this.$root.$children[0].$children;
            return tiles.filter(child => 
                (child.row === playerRow1 || child.row === playerRow2) &&
                 (child.col === playerCol1 || child.col === playerCol2));           
        },
        die: function() {

            this.isDeath = true;
            
            this.backgroundPositionDeathPointer = 0;
            this.changeDeathBackground();

            this.deathBackgroundInterval = setInterval(() => {
                this.changeDeathBackground();
            }, 200);

        },
        changeDeathBackground: function() {            
            this.backgroundPosition = this.backgroundPositions.death[this.backgroundPositionDeathPointer];
            this.backgroundPositionDeathPointer = this.backgroundPositionDeathPointer + 1;

            //animation end
            if (this.backgroundPositionDeathPointer >= this.backgroundPositions.death.length) {                
                clearInterval(this.deathBackgroundInterval);
            }
        },
        addPowerUpByType: function(type) {
            console.log(type);
            if (type === 'bomb') {
                this.maxBombs++;
            }
            else if (type === 'radius') {
                this.bombRadius++;
            }
        },
        createBomb: function(row, col) {
            let bombClass = Vue.extend(Bomb);
            let instance = new bombClass();

            instance.row = row;
            instance.col = col;
            instance.owner = this;
            instance.playground = this.$root;

            this.currentBomb = instance;

            instance.$mount();
                        
            this.currentBombCount++;

            return instance;
        },
        reduceBombCount: function() {
            this.currentBombCount--;
        }
    },
    watch: {
        top: function(newValue, oldValue) {

            if (newValue > oldValue) {
                //down
                this.changeBackground('down');
            } else {
                //up
                this.changeBackground('up');
            }
        },
        left: function(newValue, oldValue) {

            if (newValue > oldValue) {
                //right
                this.changeBackground('right');
            } else {
                //left
                this.changeBackground('left');
            }
        }
    },
    mounted: function () {
        console.log('player mounted');
        this.$on('death', this.die);        
    }
}
</script>