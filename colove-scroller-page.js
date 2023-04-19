// Page scroller by COLOVE v1.0.5
class SmoothScroll {
  constructor({
    element = window,
    strength = 4,
    acceleration = 1.1,
    deceleration = 0.95,
    damping = 0.7, 
    speed = 0.3,
    saturation = 0.3
  } = {}) {
    this.element = element;
    this.strength = strength;
    this.distance = strength * (saturation + 1);
    this.acceleration = acceleration * (saturation + 1);
    this.deceleration = deceleration;
    this.damping = damping;
    this.speed = speed * (saturation + 1);
    this.saturation = saturation;
    this.running = false;

    this.scrollHandler = this.scrollHandler.bind(this);
    this.scroll = this.scroll.bind(this);

    this.element.addEventListener('wheel', this.scrollHandler, {
      passive: false
    });
    this.element.addEventListener('mousewheel', this.scrollHandler, {
      passive: false
    });
    
    // Add event listener for the click event
    document.addEventListener('click', () => {
      this.running = false;
    });
  }

  scrollHandler(e) {
    e.preventDefault();

    if (!this.running) {
      this.top = this.element.pageYOffset || this.element.scrollTop || 0;
      this.running = true;
      this.currentDistance = e.deltaY > 0 ? 0.1 : -0.1;
      this.isDistanceAsc = true;
      this.scroll();
    } else {
      this.isDistanceAsc = false;
      this.currentDistance = e.deltaY > 0 ? this.distance : -this.distance;
    }
  }

  scroll() {
    if (this.running) {
      this.currentDistance *= this.isDistanceAsc === true ? this.acceleration : this.deceleration;
      if (Math.abs(this.currentDistance) < 0.1 && this.isDistanceAsc === false) {
        this.running = false;
      }
      if (Math.abs(this.currentDistance) >= Math.abs(this.distance)) {
        this.isDistanceAsc = false;
      }

      this.top += this.currentDistance;
      const scrollY = this.top;
      const smoothScrollY = scrollY + (this.top - scrollY) * this.damping * this.speed;

      this.element.scrollTo(0, smoothScrollY);

      requestAnimationFrame(this.scroll);
    }
  }

  setSaturation(saturation) {
    this.saturation = saturation;
    this.distance = this.strength * (saturation + 1);
    this.acceleration = this.acceleration * (saturation + 1);
    this.speed = this.speed * (saturation + 1);
  }
}

const body = new SmoothScroll();
let currentStrength = body.strength;
let lastDirection = 0;
let timeoutId;
let isScrolling = false;
const minStrength = 4; 
const maxStrength = 50;
const scrollTimeout = 300;

function updateStrength(deltaY) {
const direction = deltaY > 0 ? 1 : -1;
const deltaStrength = (lastDirection !== direction) ? 1 : 2;
currentStrength += deltaStrength;
currentStrength = Math.max(currentStrength, minStrength);
currentStrength = Math.min(currentStrength, maxStrength);
body.strength = currentStrength;
body.distance = body.strength * (body.saturation + 1);
lastDirection = direction;

clearTimeout(timeoutId);
isScrolling = true;

timeoutId = setTimeout(() => {
currentStrength = minStrength; 
body.strength = currentStrength;
body.distance = body.strength * (body.saturation + 1);
isScrolling = false;
}, scrollTimeout);
}

function animate() {
if (!isScrolling && currentStrength > minStrength) {
currentStrength--;
body.strength = currentStrength;
body.distance = body.strength * (body.saturation + 1);
}
requestAnimationFrame(animate);
}

body.element.addEventListener('wheel', e => {
e.preventDefault();
updateStrength(e.deltaY);
}, { passive: false });

body.element.addEventListener('mousewheel', e => {
e.preventDefault();
updateStrength(e.deltaY);
}, { passive: false });

animate();