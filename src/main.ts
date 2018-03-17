import * as firebase from 'firebase';
import { PlayerListener } from './playerListener';
import { config } from './config';

import './style.scss';

interface Player {
  identifier: string;
  element: HTMLElement;
}

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

let players: Player[];
let currentPlayer: Player;

// Makefix Constructor
// TODO: create a main class
function constructor() {
  players = [];
};
constructor();

/**
 * Key events to update player position.
 */
let playerListener = new PlayerListener(currentPlayer);

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
  addPlayers(snapshot.val());

  // TODO: ask for the current player here...
  currentPlayer = players[0];

  updatePlayers(snapshot.val());
});

function addPlayers(playersValue) {
  for (var key in playersValue) {
    // skip loop if the property is from prototype
    if (!playersValue.hasOwnProperty(key)) continue;

      // Create an HTML element for the player
      const playerElem: HTMLElement = document.createElement('div');
      playerElem.setAttribute('class', 'player');
      playerElem.style.backgroundColor = getRandomHexColor();
      playerElem.innerHTML = (players.length + 1).toString();
      appDiv.appendChild(playerElem);

      // Push the player onto the players array
      players.push({
        identifier: key,
        element: playerElem
      });
    }
}

function getRandomHexColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

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
  // the on function runs on page load so it will call this function
  // adding the players.length so that this code won't run unless
  // the players array is initialized
  if (players.length) {
    up = playerValues[currentPlayer.identifier].top;
    left = playerValues[currentPlayer.identifier].left;
  
    players.forEach(player => {
      player.element.style.top = playerValues[player.identifier].top + 'px';
      player.element.style.left = playerValues[player.identifier].left + 'px';
    });
  }
}