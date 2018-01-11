class Palette {
    constructor(opacity, canvas) {
        this.opacity = opacity;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.cw = this.canvas.width;
        this.ch = this.canvas.height;

        this.history = [];
        this.lineWidth = 1;

        this.style = 'stroke';
        this.fillStyle = '#000';
        this.strokeStyle = '#000';

        this.temp = [];
    }

    _init() {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.fillStyle = this.fillStyle;
    }

    draw(type, ask) {
        let that = this;
        let era = document.querySelector('.eraser');
        era.style.display = 'none';
        that.opacity.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            that.opacity.onmousemove = function (e) {
                let mx = e.offsetX, my = e.offsetY;
                that.ctx.clearRect(0, 0, that.cw, that.ch);
                if (that.history.length) {
                    that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                that._init();
                that[type](ox, oy, mx, my, ask);
            }
            that.opacity.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.opacity.onmousemove = null;
                that.opacity.onmouseup = null;
            }
        }
        that.revocation();
    }

    revocation() {
        let that = this;
        document.onkeydown = function (e) {
            if (e.ctrlKey && e.key == 'z') {
                if (that.history.length > 0) {
                    let data = that.history.pop();
                    that.ctx.putImageData(data, 0, 0)
                } else {
                    that.ctx.clearRect(0, 0, that.cw, that.ch);
                }
            }
            ;
        };
        this.history.push(this.ctx.getImageData(0, 0, this.cw, this.ch));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.cw, this.ch);
        this.history.push(this.ctx.getImageData(0, 0, this.cw, this.ch));
    }

    pencil() {
        let that = this;
        let era = document.querySelector('.eraser');
        era.style.display = 'none';
        that.opacity.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            that._init();
            that.ctx.beginPath();
            that.ctx.moveTo(ox, oy);
            that.opacity.onmousemove = function (e) {
                let mx = e.offsetX, my = e.offsetY;
                that.ctx.clearRect(0, 0, that.cw, that.ch);
                if (that.history.length) {
                    that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                that.ctx.lineTo(mx, my);
                that.ctx.stroke();
            }
            that.opacity.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.opacity.onmousemove = null;
                that.opacity.onmouseup = null;
            }
        }
        that.revocation();
    }

    eraser() {
        let that = this;
        let era = document.querySelector('.eraser');
        era.style.display = 'block';
        that.opacity.onmousedown = function (e) {
            let ox = e.offsetWidth, oy = e.offsetHeight;
            let ew = era.offsetWidth, eh = era.offsetHeight;
            let maxW = e.offsetWidth - era.offsetWidth;
            let maxH = e.offsetHeight - era.offsetHeight;
            that.opacity.onmousemove = function (e) {
                let lefts = e.offsetX - ew / 2;
                let tops = e.offsetY - eh / 2;
                if (lefts >= maxW) {
                    lefts = maxW;
                }
                if (tops >= maxH) {
                    tops = maxH;
                }
                if (lefts <= 0) {
                    lefts = 0;
                }
                if (tops <= 0) {
                    tops = 0;
                }
                era.style.left = lefts + 'px';
                era.style.top = tops + 'px';
                that.ctx.clearRect(lefts, tops, ew, eh);
            }
            that.opacity.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.opacity.onmousemove = null;
                that.opacity.onmouseup = null;
            }
        }
        that.revocation();
    }

    line(ox, oy, mx, my) {
        this.ctx.beginPath();
        this.ctx.moveTo(ox, oy);
        this.ctx.lineTo(mx, my);
        this.ctx.stroke();
    }

    dotted(ox, oy, mx, my) {
        this.ctx.setLineDash([5, 18]);
        this.ctx.beginPath();
        this.ctx.moveTo(ox, oy);
        this.ctx.lineTo(mx, my);
        this.ctx.stroke();
    }

    rect(ox, oy, mx, my) {
        this.ctx.beginPath();
        this.ctx.rect(ox, oy, mx - ox, my - oy);
        this.ctx[this.style]();
    }

    circle(ox, oy, mx, my) {
        let radius = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2));
        this.ctx.beginPath();
        this.ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        this.ctx[this.style]();
    }

    poly(ox, oy, mx, my, ask) {
        let radius = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2));
        let deg = 2 * Math.PI / ask;
        this.ctx.beginPath();
        this.ctx.moveTo(ox + radius, oy);
        for (let i = 0; i < ask; i++) {
            let x = ox + radius * Math.cos(deg * i);
            let y = oy + radius * Math.sin(deg * i);
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx[this.style]();
    }

    polygon(ox, oy, mx, my, ask) {
        let radius = Math.sqrt(Math.pow(ox - mx, 2) + Math.pow(oy - my, 2));
        let radius1 = radius / 3;
        let deg = Math.PI / ask
        this.ctx.beginPath();
        this.ctx.moveTo(ox + radius, oy);
        for (let i = 0; i < ask * 2; i++) {
            let x, y;
            if (i % 2 == 0) {
                x = ox + radius * Math.cos(deg * i);
                y = oy + radius * Math.sin(deg * i);
            } else {
                x = ox + radius1 * Math.cos(deg * i);
                y = oy + radius1 * Math.sin(deg * i);
            }
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx[this.style]();
    }

    font() {
        let fontBtn = document.querySelector('.fontBtn');
        this.opacity.onmousedown = function (e) {
            this.opacity.onmousedown = null;
            this._init();
            let ox = e.offsetX, oy = e.offsetY;
            let inputs = document.createElement('input');
            inputs.style.cssText = `
                width:100px;
                height:30px;
                padding:5px;
                position:absolute;
                left:${ox}px;
                top:${oy}px;
                z-index:9999;
            `;
            this.opacity.appendChild(inputs);
            inputs.autofocus = true;
            inputs.onblur = function () {
                let v = inputs.value;
                this.ctx.font = '20px 微软雅黑'
                this.ctx.fillText(v, ox, oy);
                this.opacity.removeChild(inputs);
                fontBtn.classList.remove('active');
            }.bind(this);


            inputs.onmousedown = function (e) {
                let ox = e.offsetX, oy = e.offsetY,
                    l = inputs.offsetLeft, m = inputs.offsetTop;
                this.opacity.onmousemove = function (e) {
                    let mx = e.clientX, my = e.clientY;
                    let lefts = l + mx - ox, tops = m + my - oy;
                    /*if (lefts <= 0) {
                        lefts = 0;
                    }
                    if (lefts >= this.cw) {
                    }*/
                    inputs.style.left = lefts + 'px';
                    inputs.style.top = tops + 'px';
                }
                inputs.onmouseup = function () {
                    this.opacity.onmousemove = null;
                    inputs.onmouseup = null;
                    console.log(1)
                }.bind(this);
            }.bind(this);
        }.bind(this);
    }

    clip(clip) {
        let that = this;
        this.opacity.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY, w, h, minx, miny;
            clip.style.display = 'block';
            clip.style.left = ox + 'px';
            clip.style.top = oy + 'px';
            that.opacity.onmousemove = function (e) {
                let mx = e.offsetX, my = e.offsetY;
                w = Math.abs(mx - ox), h = Math.abs(my - oy);
                minx = ox < mx ? ox : mx;
                miny = oy < my ? oy : my;
                clip.style.left = minx + 'px';
                clip.style.top = miny + 'px';
                clip.style.width = w + 'px';
                clip.style.height = h + 'px';
            };
            that.opacity.onmouseup = function () {
                that.opacity.onmousemove = null;
                that.opacity.onmouseup = null;
                that.temp = that.ctx.getImageData(minx, miny, w, h);
                that.ctx.clearRect(minx, miny, w, h);
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.ctx.putImageData(that.temp, minx, miny);
                that.drag(clip, minx, miny);
            }
        }
    };

    drag(clip, minx, miny) {
        let that = this;
        this.opacity.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            that.opacity.onmousemove = function (e) {
                let mx = e.offsetX, my = e.offsetY;
                let lefts = minx + mx - ox, tops = miny + my - oy;
                clip.style.left = lefts + 'px';
                clip.style.top = tops + 'px';
                that.ctx.clearRect(0, 0, that.cw, that.ch);
                if (that.history.length) {
                    that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                that.ctx.putImageData(that.temp, lefts, tops);
            }
            that.opacity.onmouseup = function () {
                that.opacity.onmousedown = null;
                that.opacity.onmousemove = null;
                that.opacity.onmouseup = null;
                clip.style.display = 'none';
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
            }
        }
    }
}