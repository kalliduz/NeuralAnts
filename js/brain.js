export default class Brain {
    constructor(inputSize = 8, hiddenSize = 4, outputSize = 3) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.weights1 = Array.from({ length: hiddenSize }, () =>
            Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
        );
        this.weights2 = Array.from({ length: outputSize }, () =>
            Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1)
        );

        // Pre-allocate arrays for performance
        this.lastInput = new Float32Array(inputSize);
        this.lastHidden = new Float32Array(hiddenSize);
        this.lastOutput = new Float32Array(4); // Fixed size 4 for actions [dx, dy, deposit, speed]
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
        // Copy inputs to avoid reference issues and for viz
        for (let i = 0; i < this.inputSize; i++) {
            this.lastInput[i] = inputs[i];
        }

        // Hidden layer
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputSize; j++) {
                sum += this.weights1[i][j] * inputs[j];
            }
            this.lastHidden[i] = sigmoid(sum);
        }

        // Output layer
        const raw = new Float32Array(this.outputSize);
        for (let i = 0; i < this.outputSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += this.weights2[i][j] * this.lastHidden[j];
            }
            raw[i] = sum;
        }

        const mag = Math.hypot(raw[0], raw[1]) || 1;
        const dirX = raw[0] / mag;
        const dirY = raw[1] / mag;
        const speed = inputs[2];
        const deposit = sigmoid(raw[2]);

        this.lastOutput[0] = dirX;
        this.lastOutput[1] = dirY;
        this.lastOutput[2] = deposit; // Neuron 3
        this.lastOutput[3] = speed;   // Pass-through

        return this.lastOutput;
    }
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
