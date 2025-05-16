class Brain {
    constructor() {
        // placeholder for neural network weights
    }

    process(inputs) {
        const [dx, dy, dist] = inputs;
        // move towards sensed direction with speed based on distance
        const speed = dist;
        return [dx, dy, speed];
    }
}
