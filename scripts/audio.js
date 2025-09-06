import {Howl} from 'howler';

export class Audio {
    init() {
        this.sounds = {
            cardMatch: new Howl({ src: ['assets/audio/CardMatch1.mp3'] }),
            flip: new Howl({ src: ['assets/audio/flip1.mp3', 'assets/audio/flip2.mp3'] }),
            noMatch: new Howl({ src: ['assets/audio/nomatch1.mp3'] }),
            whooshIn: new Howl({ src: ['assets/audio/whooshIn.mp3']}),
            whooshAway: new Howl({ src: ['assets/audio/whooshAway.mp3'] , volume:0.2 }),
            music: new Howl({ src: ['assets/audio/music.mp3'], loop: true, volume:0.5 }),
            gameOver: new Howl({ src: ['assets/audio/gameOver.mp3'], volume:0.5 }),
            titleScreen: new Howl({ src: ['assets/audio/titleMusic.mp3'], volume:0.5, loop: true })
        };
    }
    play(soundName) {
        if (this.sounds[soundName]) {
            return this.sounds[soundName].play();
        }
        return 0;
    }
    stop(soundName, id) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].stop(id);
        }
    }
}