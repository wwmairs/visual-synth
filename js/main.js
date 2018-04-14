$(document).ready(() => {
  $body = $("body");
  $canvas = $("#canvas");
  $btns = $(".osc-btn");

  var circles = {};
  // num steps in sequencer
  var steps = [];

  function playSequence(stepLength) {
    // console.log("steps:", steps);
    console.log("circles:", circles);
    // initialize steps
    for (var i = 0; i < NUMSTEPS; i++) {
      steps[i] = [];
    }
    for (var i = 0; i < circles.length; i++) {
      steps[circles[i].whichStep()].push(circles[i]);
      console.log("new steps[i]", steps[circles[i].whichStep()]);
    }
    // figure out what belongs in what step
    // play a step
    // wait stepLength
    // play the next
    // et c.
  }


  // draw sequencer step lines
  const svgns = "http://www.w3.org/2000/svg";
  var container = document.getElementById("canvas");
  var svg = document.createElementNS(svgns, "svg");
  let seqHeight = window.innerHeight - 60;
  let seqWidth = window.innerWidth;
  let stepHeight = seqHeight / NUMSTEPS;
  container.appendChild(svg);
  svg.setAttribute("width", seqWidth);
  // let's just use that hardcoded osc-btn height
  svg.setAttribute("height", seqHeight); 
  for (var i = 1; i < NUMSTEPS; i++) {
    let y = i * stepHeight;
    let line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", 0);
    line.setAttribute("x2", seqWidth);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "lightgrey");
    svg.appendChild(line);
  }


  // Create a new circle oscillator
  $btns.mousedown((e) => {
    const wavetype = e.target.id;
    const circle = new ToneCircle(e.pageX, e.pageY, wavetype);
    circles[circle.attrs.id] = circle;

    // Add circle to UI
    circle.draw($canvas);

    // Make circle drag-and-droppable
    interact("#" + circle.attrs.id)
      .draggable({
        restrict: {
          restriction: "parent",
          endOnly: true
        },
        onmove: (e) => {circle.move(e)},
      });
  })

  // (Un)highlight clicked circles
  $body.on("dblclick", ".tonecircle", (e) => {
    const circle = circles[e.target.id]
    circle.toggleHighlight();
  })

  // Delete highlighted circles
  $body.keyup((e) => {
    if (e.keyCode == keys.BACKSPACE) {
      // Delete highlighted circles
      for (var circleID in circles) {
        const circle = circles[circleID];
        if (!circle.highlighted) continue;
        circle.erase();
      }
    }
  })

  window.setInterval(playSequence, 1000);
});