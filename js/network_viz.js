export default class NetworkViz {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    draw(brain) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Background
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const radius = 6;
        const layerX = [30, this.canvas.width / 2, this.canvas.width - 30];
        const inputY = this._nodePositions(brain.inputSize, this.canvas.height);
        const hiddenY = this._nodePositions(brain.hiddenSize, this.canvas.height);
        const outputY = this._nodePositions(brain.outputSize, this.canvas.height);

        const inputActs = brain.lastInput || new Float32Array(brain.inputSize);
        const hiddenActs = brain.lastHidden || new Float32Array(brain.hiddenSize);
        const outputActs = brain.lastOutput || new Float32Array(brain.outputSize);

        const inputLabels = [
            'FdX', 'FdY', 'FdD',
            'PhX', 'PhY', 'PhV',
            'NsX', 'NsY'
        ];
        const outputLabels = ['MvX', 'MvY', 'Drp'];

        // connections input->hidden
        for (let i = 0; i < brain.hiddenSize; i++) {
            for (let j = 0; j < brain.inputSize; j++) {
                const w = brain.weights1[i][j];
                this._line(layerX[0], inputY[j], layerX[1], hiddenY[i], w);
            }
        }
        // connections hidden->output
        for (let i = 0; i < brain.outputSize; i++) {
            for (let j = 0; j < brain.hiddenSize; j++) {
                const w = brain.weights2[i][j];
                this._line(layerX[1], hiddenY[j], layerX[2], outputY[i], w);
            }
        }

        // nodes
        ctx.textAlign = 'center';
        ctx.font = '10px Roboto, Arial';

        inputY.forEach((y, i) => {
            this._circle(layerX[0], y, radius, inputActs[i]);
            ctx.fillStyle = '#aaa';
            ctx.fillText(inputLabels[i] || `I${i}`, layerX[0], y + 15);
        });
        hiddenY.forEach((y, i) => {
            this._circle(layerX[1], y, radius, hiddenActs[i]);
        });
        outputY.forEach((y, i) => {
            this._circle(layerX[2], y, radius, outputActs[i]);
            ctx.fillStyle = '#aaa';
            ctx.fillText(outputLabels[i] || `O${i + 1}`, layerX[2], y + 15);
        });
    }

    _nodePositions(count, height) {
        const spacing = height / (count + 1);
        return Array.from({ length: count }, (_, i) => spacing * (i + 1));
    }

    _line(x1, y1, x2, y2, weight) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        const w = Math.abs(weight);
        ctx.lineWidth = Math.min(w * 2, 3);
        ctx.strokeStyle = weight > 0 ? `rgba(100, 200, 100, ${Math.min(w, 1)})` : `rgba(200, 100, 100, ${Math.min(w, 1)})`;
        ctx.stroke();
    }

    _circle(x, y, r, activation) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        // Activation color: black to white/cyan
        const v = Math.floor(Math.abs(activation) * 255);
        ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

