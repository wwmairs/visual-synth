/**
  * tonecircle.js
  *  
  * Implements the ToneCircle class – a circular div with a webaudio-api oscillator bound to it.
  */

const ctx = new (window.AudioContext || window.webkitAudioContext);
const DIAMETER = 40;
var globalID = 0;

class ToneCircle {
  constructor(initx, inity, wavetype="sine") {
    // Wire up the oscillator
    this.osc  = ctx.createOscillator();
    this.gain = ctx.createGain();
    this.osc.connect(this.gain)
            .connect(ctx.destination);

    // Initialize oscillator parameters
    this.osc.type = wavetype;
    
    // Initialize circle parameters
    this.highlighted = false;
    const cx = initx - DIAMETER / 2;
    const cy = inity - DIAMETER / 2;
    this.attrs = {
      "style": "left:" + cx + "px; top:" + cy + "px",
      "class": "tonecircle",
      "type": wavetype,
      "id": "circle-" + globalID,
    }
    globalID += 1;

    // jquery self-reference, initialized after "draw" called
    this.$this = null;
  }

  draw($canvas) {
    var circle = document.createElement('div');
    for (var attr in this.attrs)
      circle.setAttribute(attr, this.attrs[attr])
    $canvas.append(circle)
    this.$this = $canvas.find("#" + this.attrs.id)

    // TODO: power-up oscillator
  }

  erase() {
    this.$this.remove()

    // TODO: teardown oscillator
  }

  toggleHighlight() {
    this.highlighted = !this.highlighted;
    if (this.highlighted)
      this.$this.css('background-color', 'black')
    else
      this.$this.css('background-color', 'grey')
  }

  move(event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // TODO: update oscillator
  }
}