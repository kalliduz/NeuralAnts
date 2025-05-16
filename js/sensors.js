class Sensors {
    constructor(ant, environment) {
        this.ant = ant;
        this.environment = environment;
    }

    read() {
        // return placeholder sensor values
        return [Math.random(), Math.random(), Math.random()];
    }
}
