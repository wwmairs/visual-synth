$(document).ready(() => {
  $body = $("body");
  $canvas = $("#canvas");
  $btns = $(".osc-btn");

  var circles = {};

  $btns.mousedown((e) => {
    const wavetype = e.target.innerHTML;
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
        onmove: circle.move
      });
  })

  // Deletion functionality
  $body.on("click", ".tonecircle", (e) => {
    const circle = circles[e.target.id]
    circle.toggleHighlight();
    console.log(circle.highlighted);
  })
  $body.keyup((e) => {
    // Delete key pressed
    if (e.keyCode == 8) {
      console.log("hey!")
      for (var circleID in circles) {
        const circle = circles[circleID];
        if (!circle.highlighted) continue;
        circle.erase();
      }
    }
  })
});