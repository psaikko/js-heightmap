"use strict";

var power_of_two = 9;

var canvas = document.getElementById("heightmap");
var g = canvas.getContext("2d");
    
var w = canvas.width = (1<<power_of_two);
var h = canvas.height = (1<<power_of_two);

var imagedata = g.getImageData(0,0,w,h);
var buffer = imagedata.data;

function index(x, y) {
  return 4 * (w * x) + 4 * y;
}

function set(x, y, c) {
  c = (255 * c) | 0;
  var i = index(x, y);
  buffer[i + 0] = c;
  buffer[i + 1] = c;
  buffer[i + 2] = c;
  buffer[i + 3] = 255;
}

function get(x, y) {
  x = (x + w) % w;
  y = (y + h) % h;
  
  return buffer[index(x,y)] / 255; 
}

var step = 1 << (power_of_two - 1);
var rotate = false;

set(0, 0, Math.random());

while (step >= 1) {

  var odd = false;

  for (var y = 0; y < h; y += step) {

    if (!rotate) y += step;

    for (var x = (rotate && odd) ? 0 : step; x < w; x += step*2) {

      var sum;

      if (rotate)
        sum = get(x-step,y) + get(x+step,y) + get(x,y-step) + get(x,y+step);
      else
        sum = get(x-step,y-step) + get(x+step,y-step) + get(x-step,y+step) + get(x+step,y+step);

      var p = step / w * 2;
      var c = sum / 4 * (1 - p) + Math.random() * p;
      set(x, y, c);
    }

    odd = !odd;

  }
  
  if (rotate) step /= 2;

  rotate = !rotate;
}

g.putImageData(imagedata, 0, 0);
