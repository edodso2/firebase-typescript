import * as firebase from 'firebase';
import { config } from './config';

import './style.scss';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

const coordsDiv: HTMLElement = document.createElement('div');
coordsDiv.setAttribute('class', 'coords');
appDiv.appendChild(coordsDiv);

const player: HTMLElement = document.createElement('div');
player.setAttribute('class', 'player');
appDiv.appendChild(player);

/**
 * Key events to update player position.
 */
document.onkeydown = checkKey;

let up;
let left;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
      // up arrow
      up-=5;
      player.style.top = `${up}px`;
    }
    else if (e.keyCode == '40') {
      // down arrow
      up+=5;
      player.style.top = `${up}px`;
    }
    else if (e.keyCode == '37') {
       // left arrow
       left-=5;
       player.style.left = `${left}px`;
    }
    else if (e.keyCode == '39') {
       // right arrow
       left+=5;
       player.style.left = `${left}px`;
    }

    updatePos(left, up);
}

/**
 * Firebase stuff
 */

// firebase app
// TODO: install some typescript types for firebase
let app;

// try to get the app if it doesn't exist then
// create it. This is needed to prevent errors on 
// page refresh. Maybe firebase does some caching?
try {
  app = firebase.app();
} catch(err) {
  app = firebase.initializeApp(config);
}

// get the initial values for the app. I think the realtime
// function below is also called when page loads so this funciton
// could be removed
firebase.database().ref('/player').once('value').then(function(snapshot) {
  player.style.top = snapshot.val().y + 'px';
  player.style.left = snapshot.val().x + 'px';

  up = snapshot.val().y;
  left = snapshot.val().x;
});

// show the new coords on the page to demo the realtime
// update of the database.
var playerPosRef = firebase.database().ref('/player');
playerPosRef.on('value', function(snapshot) {
  updateCoords(snapshot.val());
});

function updateCoords(coords) {
  coordsDiv.innerHTML = `coords: ${coords.x}, ${coords.y}`;
}

// update position in database. when the position
// is updated the above 'on' function is called.
function updatePos(x, y) {
  firebase.database().ref('/player').set({
    x,
    y
  });
}