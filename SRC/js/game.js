export class Game {
    constructor() {
        this.alarm = false;
        this.currTime = 0;
        this.maxTime = 3600;
        this.isTimerActive = false;
    }

    setTime(t) {
        this.currTime = t;
    }

    setTimerState(timerState) {
        this.isTimerActive = timerState;
    }

    update() {
        
    }

    receiveUpdate(data) {
        for (let k in data) {
            if (k in this) {
                this[k] = data[k];
            }
        }
    }
}
