import {Howl} from 'howler';

export class Audio {
    init() {
        this.sounds = {
            cardMatch: new Howl({ src: ['assets/audio/CardMatch1.mp3'] }),
            flip: new Howl({ src: ['assets/audio/flip1.mp3', 'assets/audio/flip2.mp3'] }),
            noMatch: new Howl({ src: ['assets/audio/nomatch1.mp3'] }),
            whooshIn: new Howl({ src: ['assets/audio/whooshIn.mp3']}),
            whooshAway: new Howl({ src: ['assets/audio/whooshAway.mp3'] , volume:0.2 }),
            music: new Howl({ src: ['assets/audio/music.mp3'], loop: true, volume:0.5 })
        };
    }
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
}