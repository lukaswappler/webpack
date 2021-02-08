import _ from 'lodash';
import './style.css'

import printMe from './print.js';

import xcomSprite from './assets/60963_trans.png';

function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');


    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack', 'tutorial'], ' ');
    element.classList.add('hello');
  
    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = xcomSprite;
    element.appendChild(myIcon);

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }
  
  document.body.appendChild(component());