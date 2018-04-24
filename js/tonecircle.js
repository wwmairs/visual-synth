/**
  * tonecircle.js
  *  
  * Implements the ToneCircle class – a circular div with a webaudio-api oscillator bound to it.
  */

const ctx = new (window.AudioContext || window.webkitAudioContext);
var biquadFilter = ctx.createBiquadFilter();

// playing around with FM
var modulator1 = ctx.createOscillator(),
    modGain1   = ctx.createGain(),
    modulator2 = ctx.createOscillator(),
    modGain2   = ctx.createGain();

var modProd = 1;
var modFrac = 12;

modulator1.type = "square";
modulator1.frequency.setValueAtTime(200, ctx.currentTime);
modGain1.gain.setValueAtTime(100, ctx.currentTime);
modulator1.connect(modGain1);  
modulator1.start();

modulator2.type = "triangle";
modulator2.frequency.setValueAtTime(200, ctx.currentTime);
modGain2.gain.setValueAtTime(100, ctx.currentTime);
modulator2.connect(modGain2);
modulator2.start();

// filter ish, this should be user settable too!
biquadFilter.connect(ctx.destination);
biquadFilter.type = "lowpass";
biquadFilter.frequency.setValueAtTime(1000, ctx.currentTime);
biquadFilter.gain.setValueAtTime(100, ctx.currentTime);
biquadFilter.Q.setValueAtTime(15, ctx.currentTime);

const DEFAULT_GAIN = 0.3;

var globalID = 0;

var backgroundColor = '#123552';
var highlightedColor = '#FAE773';

class ToneCircle {
  constructor(initx, inity, wavetype="sine") {
    // Wire up the oscillator
    this.osc  = ctx.createOscillator();
    this.gain = ctx.createGain();
    this.osc.connect(this.gain);
            // .connect(ctx.destination);

    // Initialize oscillator parameters
    this.osc.type = wavetype;
    
    // Initialize circle parameters
    this.highlighted = false;
    const cx = initx - circleAttrs.DIAMETER / 2;
    const cy = inity - circleAttrs.DIAMETER / 2;
    this.attrs = {
      "style": (
        "left:" + cx + "px;" +
        "top:" + cy + "px;" +
        "height:" + circleAttrs.DIAMETER + "px;" +
        "width:" + circleAttrs.DIAMETER + "px;" 
      ),
      "class": "tonecircle",
      "type": wavetype,
      "id": "circle-" + globalID,
    }
    globalID += 1;

    // jQuery self-reference, initialized after "draw" is called
    this.$this = null;
  }

  draw($canvas) {
    var circle = document.createElement('div');
    for (var attr in this.attrs)
      circle.setAttribute(attr, this.attrs[attr])
    var label = document.createElement('img');
    label.className = 'label';
    label.src = 'img/' + this.osc.type + '.svg';
    circle.appendChild(label);
    $canvas.append(circle)

    // Store jQuery reference
    this.$this = $canvas.children("#" + this.attrs.id)

    // Power up oscillator
    this.osc.frequency.setValueAtTime(0, ctx.currentTime);
    this.gain.gain.setValueAtTime(0, ctx.currentTime);
    this.gain.connect(biquadFilter);
    this.osc.start(0);

    // connect modulator to frequency
    modGain1.connect(this.osc.frequency);
    modGain2.connect(this.osc.frequency)
  }

  erase() {
    this.$this.remove();
    this.osc.disconnect(ctx);
  }

  toggleHighlight() {
    this.highlighted = !this.highlighted;
    if (this.highlighted)
      this.$this.css('border', '1px dashed rgba(255, 255, 255, 1)')
    else
      this.$this.css('border', '1px dashed rgba(255, 255, 255, 0)')
  }

  whichStep() {
    let y = this.$this.offset().top;
    let stepHeight = (window.innerHeight - 60) / NUMSTEPS;
    return Math.floor(y / stepHeight); 
  }

  makeNote(duration) {
    let modFreq = Math.floor((this.osc.frequency.value * modProd ) / 
                  (this.osc.frequency.value / modFrac)) * 
    (this.osc.frequency.value / modFrac);
    console.log("mod freq:", modFreq);
    modulator1.frequency.setValueAtTime(modFreq, ctx.currentTime);
    modulator2.frequency.setValueAtTime(modFreq, ctx.currentTime);
    this.gain.gain.setValueAtTime(DEFAULT_GAIN, ctx.currentTime);
    this.$this.css('background-color', highlightedColor);
    setTimeout(() => {
      this.gain.gain.setValueAtTime(0, ctx.currentTime);
      this.$this.css('background-color', backgroundColor);}, duration);
  }

  move(event) {
    var target = event.target,
      // Keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // Translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // Update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // Update oscillator attributes
    const newGain = (window.innerHeight - event.pageY) / oscAttrs.GAINSCALE;
    const newFreq = event.pageX / oscAttrs.FREQSCALE;

    this.osc.frequency.setValueAtTime(newFreq, ctx.currentTime);
  }
}