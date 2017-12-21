class Palette {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.history = [];
    }

    line() {
        let that = this;
        that.canvas.onmousedown = function (e) {
            let ox = e.offsetX;
            let oy = e.offsetY;
            that.canvas.onmousemove = function (e) {
                let mx = e.offsetX;
                let my = e.offsetY;
                that.ctx.clearRect(0, 0, that.cw, that.ch);
                that.ctx.beginPath();
                that.ctx.moveTo(ox, oy);
                if (that.history.length) {
                    that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                that.ctx.lineTo(mx, my);
                that.ctx.stroke();
            }
            that.canvas.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }
        }
    }

    poly(num1) {
        let that = this;
        that.canvas.onmousedown = function (e) {
            let ox = e.offsetX,
                oy = e.offsetY;
            that.canvas.onmousemove = function (e) {
                let mx = e.offsetX,
                    my = e.offsetY;
                let r = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2));
                poly1(r, ox, oy);
            }
            that.canvas.onmouseup = function () {
                that.canvas.onmousemove = null;
            }
        }

        function poly1(r, ox, oy, num = num1) {
            let ang = 2 * Math.PI / num;
            that.ctx.clearRect(0, 0, that.cw, that.ch);
            that.ctx.beginPath();
            that.ctx.moveTo(ox + r, oy);
            for (let i = 0; i < num; i++) {
                let x = ox + r * Math.cos(ang * i);
                let y = oy + r * Math.sin(ang * i);
                that.ctx.lineTo(x, y);
            }
            that.ctx.closePath();
            that.ctx.stroke();
        }
    }

    polyV(num1) {
        let that = this;
        that.canvas.onmousedown = function (e) {
            let ox = e.offsetX,
                oy = e.offsetY;
            that.canvas.onmousemove = function (e) {
                let mx = e.offsetX,
                    my = e.offsetY;
                let r = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2)),
                    r1 = r / 3;
                poly(r, r1, ox, oy);
            }
            that.canvas.onmouseup = function () {
                that.canvas.onmousemove = null;
            }
        }

        function poly(r, r1, ox, oy, num = num1) {
            let ang = Math.PI / num;
            that.ctx.clearRect(0, 0, that.cw, that.ch);
            that.ctx.beginPath();
            that.ctx.moveTo(ox + r, oy);
            for (let i = 0; i < num * 2; i++) {
                let x, y;
                if (i % 2 == 0) {
                    x = ox + r * Math.cos(ang * i);
                    y = oy + r * Math.sin(ang * i);
                } else {
                    x = ox + r1 * Math.cos(ang * i);
                    y = oy + r1 * Math.sin(ang * i);
                }
                that.ctx.lineTo(x, y);
            }
            that.ctx.closePath();
            that.ctx.stroke();
        }
    }

    circle() {
        let that = this;
        that.canvas.onmousedown = function (e) {
            let ox = e.offsetX,
                oy = e.offsetY;
            that.canvas.onmousemove = function (e) {
                let mx = e.offsetX,
                    my = e.offsetY;
                that.ctx.clearRect(0, 0, that.cw, that.ch);
                let r = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2));
                that.ctx.beginPath();
                if (that.history.length) {
                    that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                that.ctx.arc(ox, oy, r, 0, Math.PI * 2);
                that.ctx.stroke();
            }
            that.canvas.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }
        }
    }

    rect() {
        let that = this;
        that.canvas.onmousedown = function (e) {
            let ox = e.offsetX,
                oy = e.offsetY;
            that.canvas.onmousemove = function (e) {
                let mx = e.offsetX,
                    my = e.offsetY;
                that.ctx.clearRect(0, 0, that.cw, that.ch);
                let r = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2));
                that.ctx.beginPath();
                if (that.history.length) {
                    that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                that.ctx.rect(ox, oy, mx - ox, my - oy);
                that.ctx.stroke();
            }
            that.canvas.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }
        }
    }

    pencil() {
        let that = this;
        that.canvas.onmousedown = function () {
            that.ctx.beginPath()
            that.canvas.onmousemove = function (e) {
                let cx = e.offsetX;
                let cy = e.offsetY;
                that.ctx.lineTo(cx, cy);
                that.ctx.stroke();
            }
            that.canvas.onmouseup = function () {
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }
        }
    }
}