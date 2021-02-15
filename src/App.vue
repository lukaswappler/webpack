<template>
     <div id="playground" v-bind:style="styleObject()">

        <player></player>

        <div v-for="row in field">

            <div v-for="col in row">

                <tile v-bind:row="col.row" v-bind:col="col.col" v-bind:is-border="isBorder(col.row, col.col)" v-bind:is-block="isBlock(col.row, col.col)"></tile>
            </div>

        </div>
        <div style="clear:both;"></div>
    </div>
</template>

<script>
module.exports = {
  data: function() {
        return {
          fieldsize: 10,
          cols: 15,
          rows: 13,
          field: null,
          message2: 'field',
          player: null,
          pixelmap: null,
          keyboard: {
              keys: {}
          }
      }
   },
   methods: {
        styleObject: function () {
            return {
                width: this.cols * 16,
                height: this.rows * 16
            }
        },
        isBorder: function(row, col) {


            if (row === 0 || row === this.rows - 1 ) {
                return true;
            } else if (col === 0 || col === this.cols -1) {
                return true;
            }

            return false;
        },
        isBlock: function(row, col) {
            if (col %2 === 0 && row % 2 === 0) {
                return true;
            }

            return false;
        },
        move: function(eventType, event) {

            //arrow keys
            if (event.keyCode >= 37 && event.keyCode <= 40) {
                event.preventDefault();
            }

            if (eventType ==='keydown') {
                this.keyboard.keys = (this.keyboard.keys || []);
                this.keyboard.keys[event.keyCode] = (event.type == "keydown");
            }
            if (eventType ==='keyup') {
                this.keyboard.keys[event.keyCode] = (event.type == "keydown");
            }
        },
        dropBomb: function(event) {

              //space pressed (32)
              if (event.keyCode === 32) {
                  event.preventDefault();


                  if (this.player === null) {
                      this.player = this.$children.filter(child => child.$options._componentTag === 'player')[0];
                  }
                  if (this.player.isDeath) {                
                    return;
                }

                  let currentFieldRow = Math.ceil((this.player.top + 6 ) / 16) ;
                  let currentFieldCol = Math.ceil((this.player.left) / 16);

                  let currentField =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === currentFieldRow && child.col === currentFieldCol)[0];

                  //drop bomb
                  currentField.$emit('dropBombEvent', 'doIt');
              }

        },
        isKeyPressed: function (keyValue) {
            if (this.keyboard.keys && this.keyboard.keys[keyValue]) {
                return true;
            }
            return false;
        
        },
        updateGameArea: function () {
            if (this.player === null) {
                this.player = this.$children.filter(child => child.$options._componentTag === 'player')[0];
            }

            if (this.player.isDeath) {                
                return;
            }
           
            var oldTop = this.player.top;
            var oldLeft = this.player.left;


            var isRight = this.isKeyPressed(39);
            var isDown = this.isKeyPressed(40);
            var isLeft = this.isKeyPressed(37);
            var isUp = this.isKeyPressed(38);        


            var newTop = oldTop;
            var newLeft = oldLeft;

            let setNewTop = false;
            let setNewLeft = false;

            let helpLeft = 0;
            let helpTop = 0;

            if (isRight) {

                newLeft++;

                let newFieldRow1 = Math.floor((this.player.top - 6 + 16 ) / 16) ;
                let newFieldRow2 = Math.floor((this.player.top - 6 + 15 + 16) / 16) ;
                let newFieldCol = Math.ceil((newLeft) / 16);


                let newField1 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow1 && child.col === newFieldCol)[0];
                let newField2 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow2 && child.col === newFieldCol)[0];
                if (newField1 && newField1.isAccessible() &&
                    newField2 && newField2.isAccessible()) {
                    //this.player.left = newLeft;
                    setNewLeft = true;
                } else {

                    //TODO
                    if (newField1.isAccessible()) {
                        //this.player.top--;
                        helpTop= -1;
                    }
                    if (newField2.isAccessible()) {
                        //this.player.top++;
                        helpTop= 1;
                    }

                }
            }

            if (isLeft) {
                let newFieldRow1 = Math.floor((this.player.top - 6 + 16 ) / 16) ;
                let newFieldRow2 = Math.floor((this.player.top - 6 + 15 + 16) / 16) ;

                let newFieldCol = Math.ceil(((newLeft) - 16 ) / 16);

                newLeft--;


                let newField1 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow1 && child.col === newFieldCol)[0];
                let newField2 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow2 && child.col === newFieldCol)[0];
                if (newField1 && newField1.isAccessible()  &&
                    newField2 && newField2.isAccessible()) {

                    setNewLeft = true;
                    //this.player.left = newLeft;
                } else {

                    //TODO
                    if (newField1.isAccessible()) {
                        //this.player.top--;
                        helpTop= -1;
                    }
                    if (newField2.isAccessible()) {
                        //this.player.top++;
                        helpTop= 1;
                    }

                }
            }

            if (isDown) {

                newTop++;

                let newFieldRow = Math.ceil((newTop + 10 ) / 16) ;
                let colPosition1 = (newLeft) - 15;
                let colPosition2 = (newLeft);
                let newFieldCol_1 = Math.ceil((colPosition1) / 16);
                let newFieldCol_2 = Math.ceil(((colPosition2) ) / 16);


                let newField1 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow && child.col === newFieldCol_1)[0];
                let newField2 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow && child.col === newFieldCol_2)[0];
                if (newField1 && newField1.isAccessible() &&
                    newField2 && newField2.isAccessible()) {

                    //this.player.top = newTop;
                    setNewTop = true;
                } else {
                    //TODO
                    if (newField1.isAccessible()) {
                        //this.player.left--;
                        helpLeft = -1;
                    }
                    if (newField2.isAccessible()) {
                        //this.player.left++;
                        helpLeft = 1;
                    }

                }
            }

            if (isUp) {
                newTop--;

                let newFieldRow = Math.ceil((this.player.top - 6 ) / 16) ;
                let newFieldCol_1 = Math.ceil(((newLeft) - 15 ) / 16);
                let newFieldCol_2 = Math.ceil(((newLeft) ) / 16);


                let newField1 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow && child.col === newFieldCol_1)[0];
                let newField2 =  this.$children.filter(child => child.$options._componentTag === 'tile' && child.row === newFieldRow && child.col === newFieldCol_2)[0];
                if (newField1 && newField1.isAccessible() &&
                    newField2 && newField2.isAccessible()) {

                    //this.player.top = newTop;
                    setNewTop = true;
                } else {

                    //TODO
                    if (newField1.isAccessible()) {
                        //this.player.left--;
                        helpLeft = -1;
                    }
                    if (newField2.isAccessible()) {
                        //this.player.left++;
                        helpLeft = 1;
                    }
                }
            }

            //set the help, the normal movement can overrule
            
            if (helpTop !== 0) {
                this.player.top = this.player.top + helpTop;
            }
            if (helpLeft !== 0) {
                this.player.left = this.player.left + helpLeft;
            }

            
            if (setNewTop) {
                this.player.top = newTop;

            }
            if (setNewLeft) {
                this.player.left = newLeft;

            }
            
            let cells = this.player.getCurrentCells();            
            
            cells.forEach(cell => {
                if (cell.isExploding()) {
                    //trigger death
                    this.player.$emit('death', 'doIt');
                }
            });
        }
    },
    created: function () {
        // `this` points to the vm instance
        this.field = [];

        for (let row = 0; row < this.rows; row++) {

            this.field[row] = [];


            for (let col = 0; col < this.cols; col++) {
                this.field[row][col] = {type: 'cell', row: row, col: col};
            }
        }

        setInterval(this.updateGameArea, 20);

    },
    mounted: function () {

        console.log('area mounted');
      
        window.addEventListener("keypress", function(e) {
            this.move('keypress', e);
        }.bind(this));

        window.addEventListener("keyup", function(e) {
            this.move('keyup', e);
        }.bind(this));

        window.addEventListener("keydown", function(e) {
            this.move('keydown', e);
            this.dropBomb(e);
        }.bind(this));  

    }
};
</script>


<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>