export class OutdoorTemp {
    timeStamp: Date;
    degF: number;

    constructor(timeStamp: string, degF: number) {
        this.timeStamp = new Date(timeStamp)
        this.degF = degF;
    }
}
