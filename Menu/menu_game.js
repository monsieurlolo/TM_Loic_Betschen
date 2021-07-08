import { Input } from "./menu_input.js";
import { Menu } from "./menu.js";
import { PlayerProgress } from "../GlobalScripts/PlayerProgress.js";
import { Settings } from "../GlobalScripts/settings.js";

const GAMESTATE = {
    RUNNING: 0,
    SETTINGS: 1,
    ABOUT: 2
}

export class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.gameState = GAMESTATE;

        this.audio = new Audio();//audio for the menu
        this.audio.src = document.getElementById("backgroundSound1").src;
        this.musicMuted = false;
        this.soundMuted=false;

        this.savedGame = false;//true if there is already a player saved

    }

    start() {
     
        this.playerProgress = new PlayerProgress(this);
        this.playerProgress.getSavedPlayer(this);//retrieves the progress of the player or creates cookies to save the players progress
        this.menu = new Menu(this);
        this.settings=new Settings(this);
        
        this.menu.inputValue(this);

        new Input(this);

        this.buttons = [this.menu.aboutButton, this.menu.settingsButton];
        this.buttonsDown = [this.menu.aboutButton, this.menu.settingsButton, this.menu.newGameButton, this.menu.resumeGame];
        this.settingButtons=[this.menu.soundButton, this.menu.musicButton];

        this.gameState = GAMESTATE.RUNNING;

        this.audio.play();
        var c = this.playerProgress.getCookie("musicVolume",false);
        console.log(c[2]);
        this.audio.volume=c[2];
        

    }

    update(deltaTime, gameWidth, gameHeight) {
        
        this.playerProgress.updatePlayerVariables();
        this.menu.update(deltaTime, gameWidth, gameHeight, this.gameState, this.savedGame);
        this.settings.update(deltaTime, gameWidth, gameHeight, this.gameState, this.savedGame,this)
        this.audio.play();
    }

    draw(ctx) {
        this.menu.draw(ctx, this.gameState, this.savedGame, this);
        this.settings.draw(ctx, this.gameState, this.savedGame, this,this.menu.input);
    }



    toggleButtons(mouseX, mouseY) {
        this.buttonsDown.forEach((object) => {
            if (mouseX >= object.position.x &&
                mouseX <= object.position.x + object.width &&
                mouseY >= object.position.y &&
                mouseY <= object.position.y + object.height) {
                object.src = document.getElementById(object.down).src;
            } else {
                object.src = document.getElementById(object.up).src;
            }
        });
        this.settings.toggleSettingButtons(this, mouseX, mouseY);

    }
    toggleClick(mouseX, mouseY) {
        if(this.gameState==0){
            if (mouseX >= this.menu.newGameButton.position.x &&
            mouseX <= this.menu.newGameButton.position.x + this.menu.newGameButton.width &&
            mouseY >= this.menu.newGameButton.position.y &&
            mouseY <= this.menu.newGameButton.position.y + this.menu.newGameButton.height) {
  
            this.menu.newGame(this);
            this.menu.savePlayer(this);
            window.location = "./Map/map.html";
        }

        if (mouseX >= this.menu.resumeGame.position.x &&
            mouseX <= this.menu.resumeGame.position.x + this.menu.resumeGame.width &&
            mouseY >= this.menu.resumeGame.position.y &&
            mouseY <= this.menu.resumeGame.position.y + this.menu.resumeGame.height) {
            var c= this.playerProgress.getCookie("name",false);
            if (c[2]!=0) {
                this.menu.savePlayer(this);
                window.location = "./Map/map.html";
            }
        }
        }
        

        for (var i = 0; i < this.buttons.length; i++) {
            if (mouseX >= this.buttons[i].position.x &&
                mouseX <= this.buttons[i].position.x + this.buttons[i].width &&
                mouseY >= this.buttons[i].position.y &&
                mouseY <= this.buttons[i].position.y + this.buttons[i].height) {
                switch (i) {
                    case 0:
                        if (this.gameState != 2) {
                            this.gameState = GAMESTATE.ABOUT;
                        } else {
                            this.gameState = GAMESTATE.RUNNING;
                        }

                        break;
                    case 1:
                        if (this.gameState != 1) {
                            this.gameState = GAMESTATE.SETTINGS;
                        } else {
                            this.gameState = GAMESTATE.RUNNING;
                        }
                        break;
                }
            }
        }
        this.settings.toggleButtonClick(this,mouseX,mouseY);
        
    }
}
