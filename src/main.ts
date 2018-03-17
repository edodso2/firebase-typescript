import * as firebase from 'firebase';
import { config } from './config';

import './style.scss';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

const player: HTMLElement = document.createElement('div');
player.setAttribute('class', 'player');
appDiv.appendChild(player);

const player2: HTMLElement = document.createElement('div');
player2.setAttribute('class', 'player2');
appDiv.appendChild(player2);

const players = [
  {
    identifier: 'player',
    element: player
  }, 
  {
    identifier: 'player2',
    element: player2
  }
];

let currentPlayer = players[0];

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
    up -= 5;
    currentPlayer.element.style.top = `${up}px`;
  }
  else if (e.keyCode == '40') {
    // down arrow
    up += 5;
    currentPlayer.element.style.top = `${up}px`;
  }
  else if (e.keyCode == '37') {
    // left arrow
    left -= 5;
    currentPlayer.element.style.left = `${left}px`;
  }
  else if (e.keyCode == '39') {
    // right arrow
    left += 5;
    currentPlayer.element.style.left = `${left}px`;
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
} catch (err) {
  app = firebase.initializeApp(config);
}

// get the initial values for the app. I think the realtime
// function below is also called when page loads so this funciton
// could be removed
firebase.database().ref().once('value').then(function (snapshot) {
  updatePlayers(snapshot.val());
});

// show the new coords on the page to demo the realtime
// update of the database.
var playerPosRef = firebase.database().ref();
playerPosRef.on('value', function (snapshot) {
  updatePlayers(snapshot.val());
});

// update position in database. when the position
// is updated the above 'on' function is called.
function updatePos(left, top) {
  firebase.database().ref('/' + currentPlayer.identifier).set({
    left,
    top
  });
}

function updatePlayers(playerValues) {
  up = playerValues[currentPlayer.identifier].top;
  left = playerValues[currentPlayer.identifier].left;

  players.forEach(player => {
    player.element.style.top = playerValues[player.identifier].top + 'px';
    player.element.style.left = playerValues[player.identifier].left + 'px';
  });
}