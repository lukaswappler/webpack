
<template>
    <div class="enemy" v-bind:style="styleObject()"></div>
</template>

<script>
import enemySprite from '.././assets/enemy1.gif';


export default {
    data: function() {
        return {
            /*'top': 16,
            'left': 16,
              */   
            'remainingTop': 0,
            'remainingLeft': 0,
            'remainingRight': 0,
            'remainingDown': 0,
            'backgroundChangeFrequency': 100,
            'backgroundImage': enemySprite,
            'backgroundPositionPointer' : 0,
            'backgroundPosition': '-2px -115px',
            'lastMove': null,
            'lastMoveCount': 0,
            'last' : {
                'right' : null,
                'left' : null,
                'top' : null,
                'down' : null,
            },
            'backgroundPositions': {
                alive: [
                    /*
                    '-2px -115px',
                    '-20px -115px',
                    '-38px -115px',
                    '-56px -115px',
                    '-74px -115px',
                    '-92px -115px',
                    '-164px -115px',
                    '-146px -115px',
                    '-128px -115px',
                    '-110px -115px',
                    */
                    '-92px -116px',
                    '-164px -116px',
                    '-146px -116px',
                    '-128px -116px',
                    '-110px -116px',
                    '-128px -116px',
                    '-146px -116px',
                    '-164px -116px',                    

                ],                
                death: [
                     '-2px -88px',
                    '-20px -88px',
                    '-38px -88px',
                    '-56px -88px',
                    '-74px -88px',
                    '-92px -88px',                    
                    '-110px -88px',
                    '-128px -88px',
                    '-146px -88px',
                    '-164px -88px',
                    '-182px -88px',
                    '-200px -88px',
                    '-218px -88px'
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
                height: 16,
                width: 16,
                'z-index': 10000,
                'top': this.top,
                'left': this.left
            };
        },
        changeBackground: function() {                        
            this.backgroundPosition = this.backgroundPositions.alive[this.backgroundPositionPointer];
            this.backgroundPositionPointer = this.backgroundPositionPointer + 1;

            if (this.backgroundPositionPointer >= this.backgroundPositions.alive.length) {
                this.backgroundPositionPointer = 0;
            }
          
        },        
        getCurrentCells: function() {
            let playerRow1 = Math.ceil((this.top) / 16) ;                        
            let playerCol1 = Math.ceil((this.left) / 16);            

            let tiles = this.playground.$children[0].$children;
            return tiles.filter(child => 
                (child.row === playerRow1 ) &&
                 (child.col === playerCol1));           
        },
        die: function() {

            this.isDeath = true;
            clearInterval(this.moveInterval);
            clearInterval(this.changeBackgroundInterval);
            
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

                //to get sure, that the last position is the end.
                this.backgroundPosition = this.backgroundPositions.death[this.backgroundPositions.death.length - 1];

                this.$destroy();

                //// remove the element from the DOM                
                this.playground.$el.removeChild(this.$el);                
            }
        },
        move: function () {
            if (this.isDeath) {
                return;
            }
            

            let player = this.playground.$children[0].player;
            let pLeftStart = player.left;
            let pLeftEnd = player.left + 16;

            let pTopStart = player.top;
            let pTopEnd = player.top + 26;

            //console.log(pLeftStart, pLeftEnd, pTopStart, pTopEnd);
            //console.log(this.left);
            //console.log(this.top);

            //prüfen
            
            if (

            (this.top < pTopEnd || this.top + 16 < pTopStart )
            &&
            (this.left < pLeftEnd || this.left + 16 < pLeftStart)
            && 
            !this.isDeath
            ) {
                //console.log(this.top, this.left);
                //console.log(pTopStart, pTopEnd, pLeftStart, pLeftEnd);
                player.die();
                 //this.die();
            }

            
            
            //console.log(player.top);
            //console.log(player.left);




            //console.log('move');
            let currentCells = this.getCurrentCells();
            let currentCell = currentCells[0];



            if (currentCell.isExploding()) {
                console.log("DEATH!!!!!!!!!!!!");
                this.die();
            }
            
            if (this.remainingTop == 0 &&
            this.remainingDown == 0 &&
            this.remainingLeft == 0 &&
            this.remainingRight == 0
            ) {
                //choose new direction                

                let row = currentCell.row;
                let col = currentCell.col;


                let tiles = this.playground.$children[0].$children;
                
                let random = Math.floor(Math.random() * 4);

                if (random == 0) {
                    let leftCell = tiles.filter(child => (child.row === row ) && (child.col === col-1))[0]; 
                    if (leftCell && leftCell.isAccessible()) {
                        this.remainingLeft = 16;
                    }                    
                } else if (random == 1) {
                    let rightCell = tiles.filter(child => (child.row === row ) && (child.col === col+1))[0]; 
                    if (rightCell && rightCell.isAccessible()) {
                        this.remainingRight = 16
                    }
                } else if (random == 2) {
                    let topCell = tiles.filter(child => (child.row === row-1 ) && (child.col === col))[0]; 
                    if (topCell && topCell.isAccessible()) {
                        this.remainingTop = 16
                    }
                } else if (random == 3) {
                    
                    let downCell = tiles.filter(child => (child.row === row+1 ) && (child.col === col))[0]; 
                    if (downCell && downCell.isAccessible()) {
                        this.remainingDown = 16;
                    }
                }

            } else {
                //move
                if (this.remainingLeft > 0) {
                    this.left-- ;
                    this.remainingLeft --;
                } else if (this.remainingRight > 0) {
                    this.left++ ;
                    this.remainingRight --;
                } else if (this.remainingTop > 0) {
                    this.top--;
                    this.remainingTop--;
                } else if (this.remainingDown > 0) {
                    this.top++;
                    this.remainingDown--;
                }
            }

        }
    },
    watch: {
       
    },
    mounted: function () {        
        this.$on('death', this.die);   
                
        this.changeBackground();
        this.changeBackgroundInterval = setInterval(() => {
            this.changeBackground();
        }, this.backgroundChangeFrequency);        

        this.moveInterval = setInterval(this.move, 20);
    }
}
</script>