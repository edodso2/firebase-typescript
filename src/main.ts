import * as firebase from 'firebase';
import { PlayerListener } from './playerListener';
import { config } from './config';

import './style.scss';

interface Player {
  identifier: string;
  element: HTMLElement;
  pos: {
    top: number,
    left: number
  }
}

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

let players: Player[] = [];
let currentPlayer: Player;

/**
 * Key events to update player position.
 */
let playerListener: PlayerListener;

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
  currentPlayer = players[1];
  playerListener = new PlayerListener(currentPlayer);

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
        element: playerElem,
        pos: playersValue[key]
      });
    }
}

// random colors for the players
function getRandomHexColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

// show the new coords on the page to demo the realtime
// update of the database.
var playerPosRef = firebase.database().ref();
playerPosRef.on('value', function (snapshot) {
  updatePlayers(snapshot.val());
});

function updatePlayers(playerValues) {
  // the on function runs on page load so it will call this function
  // adding the players.length so that this code won't run unless
  // the players array is initialized
  if (players.length) {
    players.forEach(player => {
      player.element.style.top = playerValues[player.identifier].top + 'px';
      player.element.style.left = playerValues[player.identifier].left + 'px';
    });
  }
}