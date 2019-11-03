/* eslint-disable */
import { getScaling } from './scaling';

const scalingFactor = getScaling();

class Particle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isHidden = true;
    this.isDead = false;
  }
}

class Touch {
  constructor(x, y, force) {
    this.x = x;
    this.y = y;
    this.force = force;
  }
}

//

let s = 0,
  a = 0,
  o = 0,
  d = 0,
  l = 0,
  m = 0,
  g = 0,
  v = 0,
  x = 0,
  f = 0,
  p = 0,
  y = 0,
  M = 0,
  w = 0,
  I = 0,
  P = 0,
  k = 0,
  b = 0,
  D = 0,
  E = 0,
  C = 0,
  S = 0;

class EventEmiter {
  constructor() {
    this.events = [];
  }

  on(name, fn) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(fn);
  }

  emit(name, data) {
    const fns = this.events[name];
    for (const fn of fns) {
      fn(data);
    }
  }
}

class FreeParticle {
  constructor(opts) {
    this.eventEmitter = new EventEmiter();
    this.touches = [];
    this.state = 'stopped';
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
            this.canvas.addEventListener('mouseout', this._clearTouches))),
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

  _defaultInitContext() {
    this.context = this.context || this.canvas.getContext('2d');
    this.imageData = this.context.createImageData(this.width, this.height);
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
    this.width = 1 * t.width || this.width;
    this.height = 1 * t.height || this.height;
    this.maxWidth = t.maxWidth;
    this.maxHeight = t.maxHeight;
    this.minWidth = t.minWidth;
    this.minHeight = t.minHeight;
    this.maxWidth &&
      (/%$/.test(this.maxWidth)
        ? (this.maxWidth = (this.width * this.maxWidth.replace('%', '')) / 100)
        : (this.maxWidth *= 1));
    this.maxHeight &&
      (/%$/.test(this.maxHeight)
        ? (this.maxHeight =
            (this.height * this.maxHeight.replace('%', '')) / 100)
        : (this.maxHeight *= 1));
    this.minWidth &&
      (/%$/.test(this.minWidth)
        ? (this.minWidth = (this.width * this.minWidth.replace('%', '')) / 100)
        : (this.minWidth *= 1));
    this.minHeight &&
      (/%$/.test(this.minHeight)
        ? (this.minHeight =
            (this.height * this.minHeight.replace('%', '')) / 100)
        : (this.minHeight *= 1));
    (this.alphaFade = 0.4), (this.gravity = 1 * t.gravity || 0.08);
    this.particleGap = 1 * t.particleGap || 3;
    this.layerCount = 1 * t.layerCount || 1;
    this.rotationDuration = 1 * t.rotationDuration || 0;
    this.growDuration = 1 * t.growDuration || 200;
    this.waitDuration = 1 * t.waitDuration || 200;
    this.shrinkDuration = 1 * t.shrinkDuration || 200;
    this.shrinkDistance = 1 * t.shrinkDistance || 50;
    this.threeDimensional =
      void 0 !== t.threeDimensional &&
      'false' !== t.threeDimensional &&
      !!t.threeDimensional;
    this.lifeCycle =
      void 0 !== t.lifeCycle && 'false' !== t.lifeCycle && !!t.lifeCycle;
    this.layerDistance = t.layerDistance || this.particleGap;
    this.initPosition = t.initPosition || 'random';
    this.initDirection = t.initDirection || 'random';
    this.fadePosition = t.fadePosition || 'none';
    this.fadeDirection = t.fadeDirection || 'none';
    this.noise = isNaN(1 * t.noise) ? 10 : 1 * t.noise;
    this.disableInteraction = t.disableInteraction;
    this.mouseForce = 1 * t.mouseForce || 30;
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
    for (const origin of this.origins) {
      const rand = (Math.random() - 0.5) * this.noise;
      x = origin.x - origin.particle.x + rand;
      f = origin.y - origin.particle.y + rand;
      y = Math.sqrt(x * x + f * f);
      M = 0.01 * y;
      const rand2 = M * this.speed;
      origin.particle.vx += (x / y) * rand2;
      origin.particle.vy += (f / y) * rand2;

      for (const touch of this.touches) {
        x = origin.particle.x - touch.x;
        f = origin.particle.y - touch.y;
        y = Math.sqrt(x * x + f * f);
        M = (this.mouseForce * touch.force) / y;
        const rand3 = M * this.speed;
        origin.particle.vx += (x / y) * rand3;
        origin.particle.vy += (f / y) * rand3;
      }

      origin.particle.vx *= this.gravityFactor;
      origin.particle.vy *= this.gravityFactor;
      origin.particle.x += origin.particle.vx;
      origin.particle.y += origin.particle.vy;

      if (
        origin.particle.x < 0 ||
        origin.particle.x >= this.width ||
        origin.particle.y < 0 ||
        origin.particle.y >= this.height
      ) {
        origin.particle.isHidden = true;
        if (this.state === 'stopping') {
          origin.particle.isDead = true;
        }
      } else {
        if (this.state === 'stopping' || origin.particle.isDead) {
          s++;
        }
        origin.particle.isHidden = false;
      }
    }

    'stopping' === this.state && 0 === s && (this.state = 'stopped');
  }

  _draw() {
    for (const origin of this.origins) {
      const xPos = ~~origin.particle.x;
      const yPos = ~~origin.particle.y;
      const alpha = origin.color[3];
      const pixelIdx = 4 * (xPos + yPos * this.width);
      const oldX = ~~(origin.particle.x - origin.particle.vx);
      const oldY = ~~(origin.particle.y - origin.particle.vy);
      const oldPixelIdx = 4 * (oldX + oldY * this.width);
      this.imageData.data[oldPixelIdx + 0] = 0;
      this.imageData.data[oldPixelIdx + 1] = 0;
      this.imageData.data[oldPixelIdx + 2] = 0;
      this.imageData.data[oldPixelIdx + 3] = 255;
      if (!origin.particle.isDead && !origin.particle.isHidden) {
        this.imageData.data[pixelIdx + 0] = origin.color[0];
        this.imageData.data[pixelIdx + 1] = origin.color[1];
        this.imageData.data[pixelIdx + 2] = origin.color[2];
        this.imageData.data[pixelIdx + 3] = alpha;
      } else {
        this.imageData.data[pixelIdx + 0] = 0;
        this.imageData.data[pixelIdx + 1] = 0;
        this.imageData.data[pixelIdx + 2] = 0;
        this.imageData.data[pixelIdx + 3] = 0;
      }
    }
    this.context.putImageData(this.imageData, 0, 0);
  }

  _initParticlePosition(origin) {
    const t = origin;
    const i = origin.particle;
    switch (this.initPosition) {
      case 'random':
        i.x = Math.random() * this.width;
        i.y = Math.random() * this.height;
        break;

      case 'top':
        i.x = Math.random() * this.width * 3 - this.width;
        i.y = -Math.random() * this.height;
        break;

      case 'left':
        i.x = -Math.random() * this.width;
        i.y = Math.random() * this.height * 3 - this.height;
        break;

      case 'bottom':
        i.x = Math.random() * this.width * 3 - this.width;
        i.y = this.height + Math.random() * this.height;
        break;

      case 'right':
        i.x = this.width + Math.random() * this.width;
        i.y = Math.random() * this.height * 3 - this.height;
        break;

      case 'misplaced':
        i.x = t.x + Math.random() * this.width * 0.3 - 0.1 * this.width;
        i.y = t.y + Math.random() * this.height * 0.3 - 0.1 * this.height;
        break;

      default:
        i.x = t.x;
        i.y = t.y;
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
          for (
            D = b[a], E = b[a + 1], C = b[a + 2], o = 0;
            o < this.layerCount;
            o++
          ) {
            const origin = {
              particle: new Particle(0, 0, 0, 0),
              x: this.offsetX + g,
              y: this.offsetY + v,
              color: [D, E, C, S]
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

  get _mouseHandler() {
    return t => {
      this.touches = [
        {
          x: t.offsetX,
          y: t.offsetY,
          force: 1
        }
      ];
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
          (i.touches.push(
            new Touch(d.pageX - m.left, d.pageY - m.top, d.force || 1)
          ),
          t.preventDefault());
    };
  }

  get _clearTouches() {
    return () => {
      this.touches = [];
    };
  }
}

export const factory = (el, onDraw, onCalc, onFps) => {
  return new FreeParticle({
    image: el,
    particleGap: 7,
    mouseForce: -500,
    noise: 10,
    gravity: 0.08,
    width: ~~(el.clientWidth * scalingFactor),
    height: ~~(el.clientHeight * scalingFactor),
    maxWidth: ~~(el.clientWidth * scalingFactor),
    maxHeight: ~~(el.clientHeight * scalingFactor),
    onDraw,
    onCalc,
    onFps
  });
};
