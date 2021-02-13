import _ from 'lodash';
import './style.css'


import printMe from './print.js';

import xcomSprite from './assets/60963_trans.png';

import bombermanPlayers from './assets/super_bomberman_players.png';
import bombermanTiles from './assets/super_bomberman_tiles.png';

//vue
import cmpPlayer from './assets/vue-components/player.js';
import cmpTile from './assets/vue-components/tile.js';
import cmpBomb from './assets/vue-components/bomb.js';
import cmpBombExplosion from './assets/vue-components/bombExplosion.js';

import  './assets/vue-components/bombExplosion.js';
import  './assets/vue-components/bomb.js';

import  './assets/vue-components/player.js';
import  './assets/vue-components/tile.js';


import  './vue-app.js';

function component() {
    const element = document.createElement('div');
    //const btn = document.createElement('button');


    // Lodash, now imported by this script
    //element.innerHTML = _.join(['Hello', 'webpack', 'tutorial'], ' ');
    //element.classList.add('hello');
  
    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = bombermanPlayers;
    //element.appendChild(myIcon);



    //btn.innerHTML = 'Click me and check the console!';
    //btn.onclick = printMe;

    //element.appendChild(btn);

    return element;
}

/*
    <!-- components -->
    <script src="./assets/vue-components/player.js"></script>
    <script src="./assets/vue-components/components/tile.js"></script>
    <script src="./assets/vue-components/components/bomb.js"></script>
    <script src="./assets/vue-components/components/bombExplosion.js"></script>

    <!-- app -->
    <script src="./vue-app.js"></script>
*/

  
  document.body.appendChild(component());
  