import { GameScreen } from './gamescreen.js'
import { GameSystem } from './gamesystem.js'


// VARS
let then = 0;

var gameSystem = new GameSystem();
var gameScreen = new GameScreen(gameSystem);


function animate(now) {
    now *= 0.001;
    
    const deltaTime = now - then;
    then = now;

    gameSystem.update(deltaTime);

    gameScreen.update(deltaTime);
    gameScreen.draw(deltaTime);

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);
