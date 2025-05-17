class Brain {
    constructor(inputSize = 3, hiddenSize = 4, outputSize = 2) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.weights1 = Array.from({ length: hiddenSize }, () =>
            Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
        );
        this.weights2 = Array.from({ length: outputSize }, () =>
            Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1)
        );
    }

    clone() {
        const b = new Brain(this.inputSize, this.hiddenSize, this.outputSize);
        b.weights1 = this.weights1.map(row => row.slice());
        b.weights2 = this.weights2.map(row => row.slice());
        return b;
    }

    mutate(rate = 0.1) {
        const mutateArray = arr => arr.map(row =>
            row.map(w => w + (Math.random() * 2 - 1) * rate)
        );
        this.weights1 = mutateArray(this.weights1);
        this.weights2 = mutateArray(this.weights2);
    }

    process(inputs) {
        this.lastInput = inputs.slice();
        const hidden = this.weights1.map(row =>
            sigmoid(row.reduce((sum, w, i) => sum + w * inputs[i], 0))
        );
        this.lastHidden = hidden.slice();
        const raw = this.weights2.map(row =>
            row.reduce((sum, w, i) => sum + w * hidden[i], 0)
        );
        const mag = Math.hypot(raw[0], raw[1]) || 1;
        const dirX = raw[0] / mag;
        const dirY = raw[1] / mag;
        const speed = inputs[2];
        this.lastOutput = [dirX, dirY, speed];
        return this.lastOutput;
    }
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Export for Node.js testing without affecting browser usage
if (typeof module !== 'undefined') {
    module.exports = Brain;
}
