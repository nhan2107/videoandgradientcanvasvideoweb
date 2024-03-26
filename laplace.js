document.addEventListener('DOMContentLoaded', function()
{
      var vid = document.getElementById('video');
      var canvas = document.getElementById('canvas1');
      var context = canvas.getContext('2d');
      var back = document.createElement('canvas');
      var backcontext = back.getContext('2d');
      vid.addEventListener('play', function(){
          canvas.width = vid.clientWidth;
          canvas.height = vid.clientHeight;
          back.width = canvas.width;
          back.height = canvas.height;
          draw(vid, context, backcontext, canvas.width, canvas.height);
      },false);
},false);

document.addEventListener('DOMContentLoaded', function()
{
      var vid = document.getElementById('video');
      var canvas = document.getElementById('canvas2');
      var context = canvas.getContext('2d');
      var back = document.createElement('canvas');
      var backcontext = back.getContext('2d');
      vid.addEventListener('play', function(){
          canvas.width = vid.clientWidth;
          canvas.height = vid.clientHeight;
          back.width = canvas.width;
          back.height = canvas.height;
          draw(vid, context, backcontext, canvas.width, canvas.height);
      },false);
},false);

function draw(vid, can, b_can, c_width, c_height) 
{
      if(vid.paused || vid.ended) return false;

      b_can.drawImage(vid, 0, 0, c_width, c_height);

      var idata = b_can.getImageData(0, 0, c_width, c_height);
      var data = idata.data;
      //var height = idata.height;
      var width = idata.width;
      var limit = data.length;

      // Áp dụng bộ lọc Laplace
      const laplaceFilter = [
        [-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1]
      ];

      const filteredData = applyFilter(idata, laplaceFilter);
      
      can.putImageData(filteredData,0,0);

      setTimeout(draw, 20, vid, can, b_can, c_width, c_height);
}

    // Hàm áp dụng bộ lọc vào ảnh
function applyFilter(imageData, filter) 
{
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;
      const filteredData = new Uint8ClampedArray(data.length);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          let sum = 0;
          for (let fy = 0; fy < 3; fy++) {
            for (let fx = 0; fx < 3; fx++) {
              const fi = ((y + fy - 1) * width + (x + fx - 1)) * 4;
              sum += filter[fy][fx] * data[fi];
            }
          }
          filteredData[i] = sum;
          filteredData[i + 1] = sum;
          filteredData[i + 2] = sum;
          filteredData[i + 3] = 255;
        }
      }
      return new ImageData(filteredData, width, height);
}