var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();

app.get('/v3/*', function(req, res) {
  var callback = req.param('callback');
  res.send(callback + '({"attribution":"<a href=\\"https://www.mapbox.com/about/maps/\\" target=\\"_blank\\">&copy; Mapbox</a> <a href=\\"http://www.openstreetmap.org/about/\\" target=\\"_blank\\">&copy; OpenStreetMap</a> <a class=\\"mapbox-improve-map\\"  href=\\"https://www.mapbox.com/map-feedback/\\" target=\\"_blank\\">Improve this map</a> <a href=\\"https://www.digitalglobe.com/\\" target=\\"_blank\\">&copy; DigitalGlobe</a>","autoscale":true,"bounds":[-180,-85.0511,180,85.0511],"center":[0,0,3],"created":1362777999636,"data":["http://a.tiles.mapbox.com/v3/codeforamerica.map-mx0iqvk2/markers.geojsonp"],"dataset":"d731e37d666fc36817bbc9ad0a403d16","description":"The map used by Click That Hood (http://www.click-that-hood.com)","embed":"http://a.tiles.mapbox.com/v3/codeforamerica.map-mx0iqvk2.html","geocoder":"http://a.tiles.mapbox.com/v3/codeforamerica.map-mx0iqvk2/geocode/{query}.jsonp","id":"codeforamerica.map-mx0iqvk2","maxzoom":22,"minzoom":0,"name":"Click That Hood","private":false,"scheme":"xyz","tilejson":"2.0.0","tiles":["http://clickthatburg-proxy.codefornrv.org/tiles/codeforamerica.map-mx0iqvk2/{z}/{x}/{y}.png","http://clickthatburg-proxy.codefornrv.org/tiles/codeforamerica.map-mx0iqvk2/{z}/{x}/{y}.png"],"webpage":"http://a.tiles.mapbox.com/v3/codeforamerica.map-mx0iqvk2/page.html"});'
  )
});
app.get('/tiles/*', function (req, res) {
  var path = req.originalUrl.split("/");
  var y = path.pop().split('.')[0];
  var x = path.pop();
  var z = path.pop();
  
  var localFile = 'tiles/'+z+x+y+'.png'
  fs.stat(localFile, function(err, data) {
    if (err) {
      var image_url = "https://api.mapbox.com/styles/v1/nealf/cirtivc6j000lg9kw0ew99cdx/tiles/256/"+z+"/"+x+"/"+y+"?access_token=pk.eyJ1IjoibmVhbGYiLCJhIjoiNmM4MGQ3M2UzNmVlMTY0OWNmZDhiZjk0YWZlYzQ4OTYifQ.VEiV66Tl7sjD5n-bDLjbhw";
      var cachedFile = request.get(image_url).pipe(fs.createWriteStream('tiles/'+z+x+y+'.png'));
      cachedFile.on('finish', function() {
        fs.createReadStream(localFile).pipe(res);
      });
    } else { 
      fs.createReadStream(localFile).pipe(res);
    }
  });  
});

app.listen(3000, function () {
  console.log('Proxy listening on port 3000!');
});