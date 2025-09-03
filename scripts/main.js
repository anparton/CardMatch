import {Application, Assets, Sprite, Texture, Rectangle, Loader} from 'pixi.js';
const SIZEX = 1024;
const SIZEY = SIZEX * 9 / 16;
const sheetPath = './assets/PairsSheet.png';
const bgPath = './assets/Baize.jpg';
const cardNames = ["Hearts", "Spades", "Clubs", "Diamonds", "Back"];


const cardFrames = {
    spades:{key:"spades", file:"Spades.png"},
    hearts:{key:"hearts", file:"Hearts.png"},
    diamonds:{key:"diamonds", file:"Diamonds.png"},
    clubs:{key:"clubs", file:"Clubs.png"},

}

let app = undefined;

let textures;

(async() => {
    await init();
})();

async function init() {
    app = new Application();

    await app.init({width:SIZEX, height:SIZEY, backgroundColor:"#555555"});
    await loadGraphics((sp) => {
        textures = sp;
        document.getElementById("game").appendChild(app.canvas);
    })
    playGame();
}

async function loadGraphics(callback) {
    try {

        const tex = {};

        for (const name of cardNames) {
            const texture = await Assets.load(`./assets/${name}.png`);

            tex[name.toLowerCase()] = texture;
            console.log("Loaded "+ texture);
        }
        callback(tex);
    } catch (error) {
        console.error('Failed to load assets:', error);
    }
}

async function playGame() {

    var x = 20;
    for (var i = 0;i<cardNames.length;i++) {
        let spadesSprite = new Sprite(textures[cardNames[i].toLowerCase()]);
        spadesSprite.x = x; // Set desired x position
        spadesSprite.y = 100; // Set desired y position
        app.stage.addChild(spadesSprite);
        x += 200;
    }



}