export default class Player {

    turn = true;
    totalScore = 0;
    currentScore = 0;
    constructor(start, name = 'PLAYER 1', selectors) {
        if(!start){
            turn = false;
        }
        this.selectors = selectors;
        this.name =name.toUpperCase();
    }   
}