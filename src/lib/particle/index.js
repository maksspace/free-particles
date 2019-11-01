/* eslint-disable */
import { getScaling } from './scaling';
// eslint-disable-next-line
import Worker from 'worker-loader!./worker.js';

const scalingFactor = getScaling();

const workersNum = 4;
const workers = new Array(workersNum).fill(null).map(() => Worker());

class Particle1 {
  constructor(x, y, z, vx, vy, vz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
  }
}

var h = Math.PI,
  s = 0,
  a = 0,
  n = 0,
  o = 0,
  r = 0,
  c = 0,
  d = 0,
  l = 0,
  m = 0,
  g = 0,
  v = 0,
  u = 0,
  x = 0,
  f = 0,
  p = 0,
  y = 0,
  M = 0,
  w = 0,
  I = 0,
  _ = 0,
  P = 0,
  k = 0,
  b = 0,
  D = 0,
  E = 0,
  C = 0,
  S = 0,
  A = 0;

class NextParticle {
  constructor(opts) {
    this.state = 'stopped';
    this.touches = [];
    this.on('imageLoaded', this._onImageLoaded);
    this._initImage(opts);
    this.onDraw = opts.onDraw;
    this.onCalc = opts.onCalc;
    this.onFps = opts.onFps;
  }

  on(event, handler) {
    this.events = this.events || {};
    this.events[event] = this.events[event] || [];
    this.events[event].push(handler);
  }

  emit(event, data) {
    const handlers = this.events[event];
    for (const h of handlers) {
      h.call(this, data);
    }
  }

  start(t) {
    var i = t || {};
    (this.initPosition = i.initPosition || this.initPosition),
      (this.initDirection = i.initDirection || this.initDirection),
      this.canvas &&
        ((this.canvas.width = this.width),
        (this.canvas.height = this.height),
        (this.canvas.style.display = '')),
      this._initOrigins(),
      this._defaultInitContext();
    'running' !== this.state &&
      ((this.state = 'running'),
      this.disableInteraction ||
        ('ontouchstart' in window || window.navigator.msPointerEnabled
          ? (document.body.addEventListener('touchstart', this._touchHandler),
            document.body.addEventListener('touchmove', this._touchHandler),
            document.body.addEventListener('touchend', this._clearTouches),
            document.body.addEventListener('touchcancel', this._clearTouches))
          : (this.canvas.addEventListener('mousemove', this._mouseHandler),
            this.canvas.addEventListener('mouseout', this._clearTouches),
            this.canvas.addEventListener('click', this._clickHandler))),
      this._animate());
  }

  stop(t) {
    var i = t || {};
    (this.fadePosition = i.fadePosition || this.fadePosition),
      (this.fadeDirection = i.fadeDirection || this.fadeDirection),
      this._fade(),
      document.body.removeEventListener('touchstart', this._touchHandler),
      document.body.removeEventListener('touchmove', this._touchHandler),
      document.body.removeEventListener('touchend', this._clearTouches),
      document.body.removeEventListener('touchcancel', this._clearTouches),
      this.canvas &&
        (this.canvas.removeEventListener('mousemove', this._mouseHandler),
        this.canvas.removeEventListener('mouseout', this._clearTouches),
        this.canvas.removeEventListener('click', this._clickHandler));
  }

  _animate() {
    if (this.state !== 'stopped') {
      const st = new Date().getTime();
      this._calculate(); // 8ms
      const m = new Date().getTime();
      this._draw(); // 8ms
      const end = new Date().getTime();

      const calcfps = 1000 / (m - st);
      const drfps = 1000 / (end - m);
      const fps = 1000 / (end - st);
      this.onDraw(drfps.toFixed(2));
      this.onCalc(calcfps.toFixed(2));
      this.onFps(fps.toFixed(2));

      window.requestAnimationFrame(() => {
        return this._animate();
      });
    } else {
      this.emit('stopped');
    }
  }

  _onImageLoaded(t) {
    this.imageWidth = this.image.naturalWidth || this.image.width;
    this.imageHeight = this.image.naturalHeight || this.image.height;
    this.imageRatio = this.imageWidth / this.imageHeight;
    this.width = this.width || this.imageWidth;
    this.height = this.height || this.imageHeight;
    this.renderSize = (this.width + this.height) / 4;
    if (this.srcImage) {
      this.srcImage.style.display = 'none';
    }
    this._initSettings(t);
    this._initContext(t);
    this._initResponsive(t);
    this.start();
  }

  _initImage(t) {
    this.srcImage = t.image;
    if (!this.srcImage && t.imageId) {
      this.srcImage = document.getElementById(t.imageId);
    }
    this.imageUrl = t.imageUrl || this.srcImage.src;
    this.image = document.createElement('img');
    this.wrapperElement = t.wrapperElement || this.srcImage.parentElement;
    this.image.onload = () => {
      return this.emit('imageLoaded', t);
    };
    this.image.src = this.imageUrl;
  }

  _initContext(t) {
    this.canvas = t.canvas;
    this.canvas ||
      this.context ||
      !this.wrapperElement ||
      ((this.canvas = document.createElement('canvas')),
      this.wrapperElement.appendChild(this.canvas));
    this.convas && (this.convas.style.display = 'none');
    this.context = t.context;
  }

  _defaultInitContext(t) {
    this.context = this.context || this.canvas.getContext('2d');
  }

  _updateRotation() {
    var t = Math.cos(0),
      i = Math.sin(0),
      e = Math.cos(0),
      h = [e, 0, Math.sin(0), 0, 0, t, -i, 0, -e, i, t, 0, 0, 0, 0, 1];
    this.context.uniformMatrix4fv(
      this.uRotationMatrix,
      !1,
      new Float32Array(h)
    );
  }

  _initSettings(t) {
    (this.width = 1 * t.width || this.width),
      (this.height = 1 * t.height || this.height),
      (this.maxWidth = t.maxWidth),
      (this.maxHeight = t.maxHeight),
      (this.minWidth = t.minWidth),
      (this.minHeight = t.minHeight),
      this.maxWidth &&
        (/%$/.test(this.maxWidth)
          ? (this.maxWidth =
              (this.width * this.maxWidth.replace('%', '')) / 100)
          : (this.maxWidth *= 1)),
      this.maxHeight &&
        (/%$/.test(this.maxHeight)
          ? (this.maxHeight =
              (this.height * this.maxHeight.replace('%', '')) / 100)
          : (this.maxHeight *= 1)),
      this.minWidth &&
        (/%$/.test(this.minWidth)
          ? (this.minWidth =
              (this.width * this.minWidth.replace('%', '')) / 100)
          : (this.minWidth *= 1)),
      this.minHeight &&
        (/%$/.test(this.minHeight)
          ? (this.minHeight =
              (this.height * this.minHeight.replace('%', '')) / 100)
          : (this.minHeight *= 1)),
      (this.alphaFade = 0.4),
      (this.gravity = 1 * t.gravity || 0.08),
      (this.particleGap = 1 * t.particleGap || 3),
      (this.particleSize = 1 * t.particleSize || 1),
      (this.layerCount = 1 * t.layerCount || 1),
      (this.depth = 1 * t.depth || 1),
      (this.rotationDuration = 1 * t.rotationDuration || 0),
      (this.growDuration = 1 * t.growDuration || 200),
      (this.waitDuration = 1 * t.waitDuration || 200),
      (this.shrinkDuration = 1 * t.shrinkDuration || 200),
      (this.shrinkDistance = 1 * t.shrinkDistance || 50),
      (this.threeDimensional =
        void 0 !== t.threeDimensional &&
        'false' !== t.threeDimensional &&
        !!t.threeDimensional),
      (this.lifeCycle =
        void 0 !== t.lifeCycle && 'false' !== t.lifeCycle && !!t.lifeCycle),
      (this.layerDistance = t.layerDistance || this.particleGap),
      (this.initPosition = t.initPosition || 'random'),
      (this.initDirection = t.initDirection || 'random'),
      (this.fadePosition = t.fadePosition || 'none'),
      (this.fadeDirection = t.fadeDirection || 'none'),
      (this.noise = isNaN(1 * t.noise) ? 10 : 1 * t.noise),
      (this.disableInteraction = t.disableInteraction),
      (this.mouseForce = 1 * t.mouseForce || 30),
      (this.clickStrength = 1 * t.clickStrength || 0),
      (this.color = t.color),
      (this.colorArr = t.colorArr || this.colorArr);
  }

  _initResponsive(t) {
    var i = this;
    (this.responsiveWidth = this.wrapperElement && t.responsiveWidth),
      this.responsiveWidth &&
        (this.on('stopped', function() {
          (i.width = i.wrapperElement.clientWidth), i.start();
        }),
        this.wrapperElement.addEventListener('resize', function() {
          i.width !== i.wrapperElement.clientWidth && i.stop();
        }),
        (this.width = this.wrapperElement.clientWidth));
  }
 
  _calculate() {
    for (let i = 0; i < this.origins.length; i++) {
      const r = this.origins[i];
      const c = r.particle;

      x = r.x - c.x + -0.5 * this.noise;
      f = r.y - c.y + -0.5 * this.noise;
      p = r.z - c.z + (-0.5 * this.noise) / 1e3;
      y = Math.sqrt(x * x + f * f + p * p);
      M = 0.01 * y;
      c.vx += M * (x / y) * this.speed;
      c.vy += M * (f / y) * this.speed;
      c.vz += M * (p / y) * this.speed;

      for (l = 0; l < this.touches.length; l++) {
        d = this.touches[l];
        x = c.x - d.x;
        f = c.y - d.y;
        p = c.z - d.z;
        y = Math.sqrt(x * x + f * f + p * p);
        M = (this.mouseForce * d.force) / y;
        c.vx += M * (x / y) * this.speed;
        c.vy += M * (f / y) * this.speed;
        c.vz += M * (p / y) * this.speed;
      }

      c.vx *= this.gravityFactor;
      c.vy *= this.gravityFactor;
      c.vz *= this.gravityFactor;
      c.x += c.vx;
      c.y += c.vy;
      c.z += c.vz;

      c.x < 0 || c.x >= this.width || c.y < 0 || c.y >= this.height
        ? ((c.isHidden = !0), 'stopping' === this.state && (c.isDead = !0))
        : ('stopping' !== this.state || c.isDead || s++, (c.isHidden = !1));
    }

    'stopping' === this.state && 0 === s && (this.state = 'stopped');
  }

  _draw() {
    this.depth = Math.max(
      (this.layerDistance * this.layerCount) / 2,
      this.mouseForce
    );
    this.minZ = -this.depth;
    this.maxZ = this.depth;
    const h = this.context.createImageData(this.width, this.height);
    this.origins.forEach(r => {
      const c = r.particle;
      c.isDead ||
        c.isHidden ||
        ((g = ~~c.x),
        (v = ~~c.y),
        (S = r.color[3]),
        0 < this.alphaFade &&
          1 < this.layerCount &&
          ((u = Math.max(Math.min(c.z, this.maxZ), this.minZ) - this.minZ),
          (S =
            S * (1 - this.alphaFade) +
            S * this.alphaFade * (u / (this.maxZ - this.minZ))),
          (S = Math.max(Math.min(~~S, 255), 0))),
        (n = 4 * (g + v * this.width)),
        (h.data[n + 0] = r.color[0]),
        (h.data[n + 1] = r.color[1]),
        (h.data[n + 2] = r.color[2]),
        (h.data[n + 3] = S));
    });
    this.context.putImageData(h, 0, 0);
  }

  _initParticlePosition(origin) {
    const t = origin;
    const i = origin.particle;
    switch (((i.z = 0), this.initPosition)) {
      case 'random':
        (i.x = Math.random() * this.width), (i.y = Math.random() * this.height);
        break;

      case 'top':
        (i.x = Math.random() * this.width * 3 - this.width),
          (i.y = -Math.random() * this.height);
        break;

      case 'left':
        (i.x = -Math.random() * this.width),
          (i.y = Math.random() * this.height * 3 - this.height);
        break;

      case 'bottom':
        (i.x = Math.random() * this.width * 3 - this.width),
          (i.y = this.height + Math.random() * this.height);
        break;

      case 'right':
        (i.x = this.width + Math.random() * this.width),
          (i.y = Math.random() * this.height * 3 - this.height);
        break;

      case 'misplaced':
        (i.x = t.x + Math.random() * this.width * 0.3 - 0.1 * this.width),
          (i.y = t.y + Math.random() * this.height * 0.3 - 0.1 * this.height);
        break;

      default:
        (i.x = t.x), (i.y = t.y);
    }
  }

  _fade() {
    if (
      ('explode' === this.fadePosition ||
      'top' === this.fadePosition ||
      'left' === this.fadePosition ||
      'bottom' === this.fadePosition ||
      'right' === this.fadePosition
        ? (this.state = 'stopping')
        : (this.state = 'stopped'),
      this.origins)
    )
      for (a = 0; a < this.origins.length; a++)
        this._fadeOriginPosition(this.origins[a]),
          this._fadeOriginDirection(this.particles[a]);
  }

  _fadeOriginPosition(t) {
    switch (this.fadePosition) {
      case 'random':
        (t.x = Math.random() * this.width * 2 - this.width),
          (t.y = Math.random() * this.height * 2 - this.height),
          0 < t.x && (t.x += this.width),
          0 < t.y && (t.y += this.height);
        break;

      case 'top':
        (t.x = Math.random() * this.width * 3 - this.width),
          (t.y = -Math.random() * this.height);
        break;

      case 'left':
        (t.x = -Math.random() * this.width),
          (t.y = Math.random() * this.height * 3 - this.height);
        break;

      case 'bottom':
        (t.x = Math.random() * this.width * 3 - this.width),
          (t.y = this.height + Math.random() * this.height);
        break;

      case 'right':
        (t.x = this.width + Math.random() * this.width),
          (t.y = Math.random() * this.height * 3 - this.height);
    }
  }

  _initParticleDirection(t) {
    switch (((t.vz = 0), this.initDirection)) {
      case 'random':
        (w = Math.random() * Math.PI * 2),
          (I = Math.random()),
          (t.vx = this.width * I * Math.sin(w) * 0.1),
          (t.vy = this.height * I * Math.cos(w) * 0.1);
        break;

      case 'top':
        (w = Math.random() * Math.PI - Math.PI / 2),
          (I = Math.random()),
          (t.vx = this.width * I * Math.sin(w) * 0.1),
          (t.vy = this.height * I * Math.cos(w) * 0.1);
        break;

      case 'left':
        (w = Math.random() * Math.PI + Math.PI),
          (I = Math.random()),
          (t.vx = this.width * I * Math.sin(w) * 0.1),
          (t.vy = this.height * I * Math.cos(w) * 0.1);
        break;

      case 'bottom':
        (w = Math.random() * Math.PI + Math.PI / 2),
          (I = Math.random()),
          (t.vx = this.width * I * Math.sin(w) * 0.1),
          (t.vy = this.height * I * Math.cos(w) * 0.1);
        break;

      case 'right':
        (w = Math.random() * Math.PI),
          (I = Math.random()),
          (t.vx = this.width * I * Math.sin(w) * 0.1),
          (t.vy = this.height * I * Math.cos(w) * 0.1);
        break;

      default:
        (t.vx = 0), (t.vy = 0);
    }
  }

  _fadeOriginDirection(t) {
    switch (this.fadeDirection) {
      case 'random':
        (w = Math.random() * Math.PI * 2),
          (I = Math.random()),
          (t.vx += this.width * I * Math.sin(w) * 0.1),
          (t.vy += this.height * I * Math.cos(w) * 0.1);
        break;

      case 'top':
        (w = Math.random() * Math.PI - Math.PI / 2),
          (I = Math.random()),
          (t.vx += this.width * I * Math.sin(w) * 0.1),
          (t.vy += this.height * I * Math.cos(w) * 0.1);
        break;

      case 'left':
        (w = Math.random() * Math.PI + Math.PI),
          (I = Math.random()),
          (t.vx += this.width * I * Math.sin(w) * 0.1),
          (t.vy += this.height * I * Math.cos(w) * 0.1);
        break;

      case 'bottom':
        (w = Math.random() * Math.PI + Math.PI / 2),
          (I = Math.random()),
          (t.vx += this.width * I * Math.sin(w) * 0.1),
          (t.vy += this.height * I * Math.cos(w) * 0.1);
        break;

      case 'right':
        (w = Math.random() * Math.PI),
          (I = Math.random()),
          (t.vx += this.width * I * Math.sin(w) * 0.1),
          (t.vy += this.height * I * Math.cos(w) * 0.1);
        break;

      default:
        (t.vx = 0), (t.vy = 0);
    }
  }

  _initOrigins() {
    P = document.createElement('canvas');
    this.responsiveWidth && (this.width = this.wrapperElement.clientWidth);
    (this.ratio =
      Math.min(this.width, this.maxWidth || Number.POSITIVE_INFINITY) /
      Math.min(this.height, this.maxHeight || Number.POSITIVE_INFINITY)),
      console.log(this.ratio, this.imageRatio),
      this.ratio < this.imageRatio
        ? ((this.renderWidth = ~~Math.min(
            this.width || Number.POSITIVE_INFINITY,
            this.minWidth || this.imageWidth || Number.POSITIVE_INFINITY,
            this.maxWidth || Number.POSITIVE_INFINITY
          )),
          (this.renderHeight = ~~(this.renderWidth / this.imageRatio)))
        : ((this.renderHeight = ~~Math.min(
            this.height || Number.POSITIVE_INFINITY,
            this.minHeight || this.imageHeight || Number.POSITIVE_INFINITY,
            this.maxHeight || Number.POSITIVE_INFINITY
          )),
          (this.renderWidth = ~~(this.renderHeight * this.imageRatio))),
      (this.offsetX = ~~((this.width - this.renderWidth) / 2)),
      (this.offsetY = ~~((this.height - this.renderHeight) / 2)),
      (P.width = this.renderWidth),
      (P.height = this.renderHeight),
      (k = P.getContext('2d')).drawImage(
        this.image,
        0,
        0,
        this.renderWidth,
        this.renderHeight
      ),
      (b = k.getImageData(0, 0, this.renderWidth, this.renderHeight).data);

    this.origins = [];
    for (g = 0; g < this.renderWidth; g += this.particleGap)
      for (v = 0; v < this.renderHeight; v += this.particleGap)
        if (((a = 4 * (g + v * this.renderWidth)), 0 < (S = b[a + 3]))) {
          var i = Math.random();
          for (
            D = b[a], E = b[a + 1], C = b[a + 2], o = 0;
            o < this.layerCount;
            o++
          ) {
            const origin = {
              particle: new Particle1(0, 0, 0, 0, 0, 0),
              x: this.offsetX + g,
              y: this.offsetY + v,
              z: o * this.layerDistance + 50,
              color: [D, E, C, S],
              tick: A,
              seed: i,
              vertexColors: [D / 255, E / 255, C / 255, S / 255]
            };
            this._initParticlePosition(origin);
            this._initParticleDirection(origin);
            this.origins.push(origin);
          }
        }
    this.speed = Math.log(this.origins.length) / 10;
    this.gravityFactor = 1 - this.gravity * this.speed;
  }

  _parseColor(t) {
    let i = 0;

    if ('string' == typeof t) {
      var e = t.replace(' ', '');
      if ((i = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(e)))
        i = [parseInt(i[1], 16), parseInt(i[2], 16), parseInt(i[3], 16)];
      else if ((i = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(e)))
        i = [
          17 * parseInt(i[1], 16),
          17 * parseInt(i[2], 16),
          17 * parseInt(i[3], 16)
        ];
      else if (
        (i = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(e))
      )
        i = [+i[1], +i[2], +i[3], +i[4]];
      else {
        if (!(i = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(e))) return;
        i = [+i[1], +i[2], +i[3]];
      }
      return i;
    }
  }

  set color(t) {
    this.colorArr = this._parseColor(t);
    this.colorArr &&
      (isNaN(this.colorArr[3]) && (this.colorArr[3] = 255),
      0 < this.colorArr[3] &&
        this.colorArr[3] <= 1 &&
        (this.colorArr[3] *= 255));
  }

  get _mouseHandler() {
    return t => {
      this.touches = [
        {
          x: t.offsetX,
          y: t.offsetY,
          z: 49 + (this.layerCount - 1) * this.layerDistance,
          force: 1
        }
      ];
    };
  }

  get _clickHandler() {
    return () => {
      const i = this.clickStrength;
      this.origins.map(t => (t.z -= i));
    };
  }

  get _touchHandler() {
    var i = this;
    return function(t) {
      for (
        i.touches = [], m = i.canvas.getBoundingClientRect(), l = 0;
        l < t.changedTouches.length;
        l++
      )
        (d = t.changedTouches[l]).target === i.canvas &&
          (i.touches.push({
            x: d.pageX - m.left,
            y: d.pageY - m.top,
            z: 49 + (i.layerCount - 1) * i.layerDistance,
            force: d.force || 1
          }),
          t.preventDefault());
    };
  }

  get _clearTouches() {
    var i = this;
    return function(t) {
      i.touches = [];
    };
  }
}

export const Particle = (el, onDraw, onCalc, onFps) => {
  return new NextParticle({
    image: el,
    particleGap: 5,
    mouseForce: 100,
    // clickStrength: 1,
    noise: 20,
    gravity: 0.08,
    width: ~~(el.clientWidth * scalingFactor * 2),
    height: ~~(el.clientHeight * scalingFactor * 2),
    maxWidth: ~~(el.clientWidth * scalingFactor),
    maxHeight: ~~(el.clientHeight * scalingFactor),
    onDraw,
    onCalc,
    onFps
    // particleSize: 10,
    // layerCount: 2,
    // depth: 1,
    // layerDistance: 1,
    // lifeCycle: 0,
    // growDuration: 1,
    // waitDuration: 1,
    // shrinkDuration: 1,
    // shrinkDistance: 1
  });
};
