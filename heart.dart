#import('dart:html');

class heart {

  var _intervalId;
  var count = 0;
  var offset = 0;

  
  heart() {
  }

  void run() {
   
    CanvasElement drawingArea = document.query('#drawingArea');

    drawingArea.width = window.innerWidth - 100; 
    drawingArea.height = window.innerHeight - 100;

    _intervalId = document.window.setInterval(this.heartMaker, 30);   

  }

  void heartMaker(){
 
    CanvasElement drawingArea = document.query('#drawingArea');
    CanvasRenderingContext2D ctx = drawingArea.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,window.innerWidth - 100,window.innerHeight - 100); 
   
    for(var i = 0; i <= window.innerHeight - 100; i += (window.innerHeight - 100)/20 ) {

      var y = (window.innerWidth - 100)/6 * Math.sin(count + offset) + (window.innerWidth - 100)/2;
      var r = 30 * Math.sin(count) + 50; 


      ctx.fillStyle = 'hsl(' + i + ',' + r*2 + '%,50%)';

      ctx.font = "" + r + 'px Arial'; 
      ctx.fillText( '\u2665 ', -y + (window.innerWidth - 100), i );
      
      ctx.font = "" + r + 'px Arial';       
      ctx.fillText( '\u2665 ', y, i );
      
      offset += 0.2; 
    }
    
    offset = 0;
    count += 0.05;    
    
  }
}

void main() {
  new heart().run();
}
