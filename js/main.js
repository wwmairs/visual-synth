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
        onmove: (e) => {circle.move(e)}
      });
  })

  // (Un)highlight clicked circles
  $body.on("dblclick", ".tonecircle", (e) => {
    const circle = circles[e.target.id]
    circle.toggleHighlight();
  })

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
});