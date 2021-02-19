
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
            'isExploded': false,
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
            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;
            this.backgroundPositionPointer = this.backgroundPositionPointer % this.backgroundPositions.length;

            this.backgroundPosition = this.backgroundPositions[this.backgroundPositionPointer];
        },
        changeExplodeBackground: function() {
            this.backgroundPosition = this.backgroundExplodePositions[this.backgroundPositionPointer];

            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;            

            //animation end
            //destroy bomb itself
            if (this.backgroundPositionPointer >= this.backgroundExplodePositions.length) {
                clearInterval(this.exploadeBackgroundInterval);

                this.$destroy();

                //// remove the element from the DOM
                this.$el.parentNode.removeChild(this.$el);    
            }

        },
        createTileExplosions: function (bombRadius, direction, row, col) {
                    let tiles = this.playground.$children[0].$children;
                    let foundTiles = new Array();
                    
                    for (var i = 1; i <= bombRadius; i++) {
                        let tile;

                        //Todo, viel schöner machen mit getLeftTile oder so
                        if (direction === 't') {
                            tile = tiles.filter(child => child.row === row - i && child.col === col)[0];
                        } else if (direction === 'd') {
                            tile = tiles.filter(child => child.row === row + i && child.col === col)[0];
                        } else if (direction === 'l') {
                            tile = tiles.filter(child => child.row === row && child.col === col - i)[0];
                        } else if (direction === 'r') {
                            tile = tiles.filter(child => child.row === row && child.col === col + i)[0];
                        }                                

                        if (tile && tile.isExplosionPossible()) {
                            foundTiles.push(tile);                        
                        }  else {
                            tile.destroyTile();
                            //blockade gefunden
                            break;
                        }
                    }    

                    let counter = 0;
                    foundTiles.forEach(function(tile) {
                        counter++;
                        tile.$emit('bombExplosion',  (counter === foundTiles.length ? direction : direction + direction));
                    });
                },
                explodeBomb: function() {
                    //stop ticker background
                    clearInterval(this.tickBackgroundInterval);

                    this.backgroundPositionPointer = 0;

                    //trigger explosion
                    if (this.playground) {                        
                        this.owner.reduceBombCount();

                        let tiles = this.playground.$children[0].$children;

                        this.$destroy();

                        //// remove the element from the DOM
                        this.$el.parentNode.removeChild(this.$el);

                        this.isExploded = true;

                        clearInterval(this.bomeExplosionTimeout);

                        //center
                        let center = tiles.filter(child => child.row === this.row  && child.col ===this.col)[0];                
                        center.$emit('bombExplosion','c');
                        
                        //other directions
                        this.createTileExplosions( this.bombRadius, 't', this.row, this.col);
                        this.createTileExplosions( this.bombRadius, 'd', this.row, this.col);
                        this.createTileExplosions( this.bombRadius, 'r', this.row, this.col);
                        this.createTileExplosions( this.bombRadius, 'l', this.row, this.col);
                        
                        
                    }
                }
    },
    created: function() {
        
    },
    mounted: function () {
        
        this.tickBackgroundInterval = setInterval(() => {
            this.changeBackground();
        }, this.bombTickRate);

        this.bomeExplosionTimeout = setTimeout(function() {
            this.explodeBomb();

        }.bind(this), this.bombExplosionTimer);

    },
    
}
</script>