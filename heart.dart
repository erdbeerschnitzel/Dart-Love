import 'dart:html';
import 'dart:math';

var _intervalId;
var count = 0;
var offset = 0;

heartMaker(){

    CanvasElement drawingArea = document.query('#drawingArea');
    CanvasRenderingContext2D ctx = drawingArea.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,window.innerWidth - 100,window.innerHeight - 150);

    for(double i = 0.0; i <= window.innerHeight - 150; i += (window.innerHeight - 150)/20 ) {

      var y = (window.innerWidth - 100)/6 * sin(count + offset) + (window.innerWidth - 100)/2;
      var r = 15 * sin(count) + 50;

      ctx.fillStyle = "hsl($i,$r%,50%)";

      ctx.font = "${r/2}px Arial";

      ctx.fillText( '\u2665 ', -y + (window.innerWidth - 100), i );

      ctx.fillText( '\u2665 ', y, i );

      offset += 0.2;
    }

    offset = 0;
    count += 0.05;

  }


main(){
  
  CanvasElement drawingArea = document.query('#drawingArea');

  drawingArea.width = window.innerWidth - 100;
  drawingArea.height = window.innerHeight - 150;

  _intervalId = window.setInterval(heartMaker, 30);
}
