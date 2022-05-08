export class HydronicZone {

    // SVG PATH (line) Declarations
    lineRT: number[] = [];            // Return Temperature
    lineSP: number[] = [];            // Supply Temperature
    rmTmpStates: RMTMPState[] = [];   // Room Temperture     
    lineRMHUM: number[] = [];         // Room Humidiy

    // SVG SHAPE Declarations
    pumpActive: number[] = [];        // Pump active state
    heatCall: number[] = [];          // Call for heat
    lowAlarm: number[] = [];          // Low temperature alarm
    highAlarm: number[] = [];         // High temperature alarm
    tstatStates: TstatState[] = []    // Holds thermostat calls
    tstatTemps: tstatTemp[] = []      // Holds thermostat temperatures

    constructor() { }
}
export class TstatState {
    _timeStamp: Date;
    _systemOn: boolean;

    constructor(timeStamp: string, systemOn: boolean) {
        this._timeStamp = new Date(timeStamp)
        this._systemOn = systemOn;
    }
}
export class RMTMPState {
    timeStamp: Date;
    temperatureF: number;
    constructor(timesStamp: string, degreesFahrenheit: number) {
        this.timeStamp = new Date(timesStamp);
        this.temperatureF = degreesFahrenheit;
    }
}
export class tstatTemp {
    timeStamp: Date;
    degF: number;
    constructor(timesStamp: string, degF: number) {
        this.timeStamp = new Date(timesStamp);
        this.degF = degF;
    }
}