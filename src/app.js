import Vue from 'vue';

import Player from './components/Player.vue';
import Tile from './components/Tile.vue';
import Bomb from './components/Bomb.vue';
import BombExplosion from './components/BombExplosion.vue';
import PowerUp from './components/PowerUp.vue';

import App from './App.vue';

Vue.component('player', Player);
Vue.component('tile', Tile);
Vue.component('bomb', Bomb);
Vue.component('bombexplosion', BombExplosion);
Vue.component('powerUp', PowerUp);


new Vue({
    el: '#app',
    render: h=> h(App),
    components: {
        Player,
        Tile,
        Bomb,
        PowerUp
    }
});