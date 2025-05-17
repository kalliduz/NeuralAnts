class NetworkViz {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    draw(brain) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const radius = 5;
        const layerX = [20, this.canvas.width / 2, this.canvas.width - 20];
        const inputY = this._nodePositions(brain.inputSize, this.canvas.height);
        const hiddenY = this._nodePositions(brain.hiddenSize, this.canvas.height);
        const outputY = this._nodePositions(brain.outputSize, this.canvas.height);

        // connections input->hidden
        ctx.strokeStyle = '#999';
        for (let i = 0; i < brain.hiddenSize; i++) {
            for (let j = 0; j < brain.inputSize; j++) {
                this._line(layerX[0], inputY[j], layerX[1], hiddenY[i]);
            }
        }
        // connections hidden->output
        for (let i = 0; i < brain.outputSize; i++) {
            for (let j = 0; j < brain.hiddenSize; j++) {
                this._line(layerX[1], hiddenY[j], layerX[2], outputY[i]);
            }
        }
        // nodes
        ctx.fillStyle = '#222';
        inputY.forEach(y => this._circle(layerX[0], y, radius));
        hiddenY.forEach(y => this._circle(layerX[1], y, radius));
        outputY.forEach(y => this._circle(layerX[2], y, radius));
    }

    _nodePositions(count, height) {
        const spacing = height / (count + 1);
        return Array.from({ length: count }, (_, i) => spacing * (i + 1));
    }

    _line(x1, y1, x2, y2) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    _circle(x, y, r) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
}

if (typeof module !== 'undefined') {
    module.exports = NetworkViz;
}

