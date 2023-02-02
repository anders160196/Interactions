//  ======== T-SNE ========
/*
import features from '/features.json' assert {type: 'json'};

var opt = {}
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 2; // dimensionality of the embedding (2 = default)
var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

var data = [];

for (let i in features) {
  var f = features[i][1];
  //console.log(i);
  //console.log(f);
  
  data.push([f['acousticness'], f['danceability'], f['energy'], f['instrumentalness'], f['liveness'], f['loudness'], f['speechiness'], f['tempo'], f['valence']]);
  //Available: f['acousticness'], f['danceability'], f['energy'], f['instrumentalness'], f['liveness'], f['loudness'], f['speechiness'], f['tempo'], f['valence']
}

var outputArray;

var genres = {}
for (const genre of ['Pop', 'Rock', 'Techno', 'Jazz', 'Classical', 'Hip Hop']) {
  genres[genre] = {'x': [], 'y': [], 'title': [], 'linewidth': []}
}

function runTSNE() {
  tsne.initDataRaw(data);
  
  for (var k = 0; k < 1000; k++) {
    tsne.step(); // every time you call this, solution gets better
  }
  outputArray = tsne.getSolution(); // array of 2-D points that you can plot

  // Split by genre and attach name
  var i = 0;
  for (const [genre, song] of Object.entries(genres)) {
    i = 0;
    for (const [title, info] of Object.entries(features)) {
      if (info[0] == genre) {
        //console.log(genre, title, info[1]['acousticness']);
        //console.log(genres);
        //genres[genre].push([outputArray[i][0], outputArray[i][1], title])
        genres[genre]['x'].push(outputArray[i][0]);
        genres[genre]['y'].push(outputArray[i][1]);
        genres[genre]['title'].push(title);
        genres[genre]['linewidth'].push(2);
      }
      i++
    }
  }
}

runTSNE();

outputArray.sort((a, b) => a[0] - b[0]);
*/

import genres from '/array.json' assert {type: 'json'};

//  ======== PLOTLY ========

var layout = {
  xaxis: {
    autorange: false,
    range: [-2, 3],
    showgrid: false,
    zeroline: false,
    visible: false
  },
  yaxis: {
    autorange: false,
    range: [-0.5, 1.75],
    showgrid: false,
    zeroline: false,
    visible: false
  },
  margin: {
    l: 70,
    r: 70,
    b: 70,
    t: 70,
    pad: 4
  },
  modebar: {bgcolor: '#f5fcff'},
  plot_bgcolor:'#f5fcff',
  paper_bgcolor:'rgba(0,0,0,0)',
  dragmode: "pan"
};

var config = {
  responsive: true,
  displaylogo: false,
  displayModeBar: true,
  modeBarButtonsToRemove: ['toImage', 'select2d', 'lasso2d', 'resetScale2d'],
  modeBarButtonsToAdd: [
    { name: 'Show all points',
      icon: Plotly.Icons.pencil,
      click: function(gd) {alert('Not yet programmed!')}
    }]
}

var plotData = [];
function traceAll() {
  for (const [key, value] of Object.entries(genres)) {
    var trace = {
      x: value['x'],
      y: value['y'],
      mode: 'markers+text',
      type: 'scatter',
      name: key,
      text: value['title'],
      hoverinfo: 'name',
      //visible: 'legendonly',
      textposition: 'top center',
      textfont: {
        family:  'Raleway, sans-serif'
      },
      marker: {
        size: 40,
        line: {
          width: value['linewidth']
        }
      }
    };
    
    plotData.push(trace);
  }
}

traceAll();
Plotly.newPlot('myDiv', plotData, layout, config);


//  ======== AUDIO ========
var audio = new Audio();
var myPlot = document.getElementById('myDiv');

myPlot.on('plotly_hover', function(data){
  var song = '';
  var trace = '';
  var pn = '';
  var tn = '';
  var linewidths = [];
  
  for(var i=0; i < data.points.length; i++){
    song = data.points[i].text;
    trace = data.points[i].data.name;
    pn = data.points[i].pointNumber;
    tn = data.points[i].curveNumber;
    linewidths = data.points[i].data.marker.line.width;
  }
  
  linewidths[pn] = 4;
  var update = {'marker':{size: 40, line: {width: linewidths}}};
  Plotly.restyle('myDiv', update, [tn]);
  
  console.log('song: ' + song);
  console.log('trace: ' + trace);
  if (trace != 'all') {
    audio.src = 'music/genres/' + trace + '/' + song + '.wav';
    audio.play();
  }
});

myPlot.on('plotly_unhover', function(data){
  var pn = '';
  var tn = '';
  var linewidths = [];
  
  for(var i=0; i < data.points.length; i++){
    pn = data.points[i].pointNumber;
    tn = data.points[i].curveNumber;
    linewidths = data.points[i].data.marker.line.width;
  }
  
  linewidths[pn] = 2;
  var update = {'marker':{line: {width: widths}}};
  Plotly.restyle('myDiv', update, [tn]);
});


myPlot.on('plotly_click', function(data){
  var x = '';
  var y = '';
  for(var i=0; i < data.points.length; i++){
    x = data.points[i].x;
    y = data.points[i].y;
  }
  
  Plotly.animate('myDiv', {
    layout: {
      xaxis: {range: [x-2.5, x+2.5]},
      yaxis: {range: [y-1.125, y+1.125]}
    }
  }, {
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    }
  })
  
});


//  ======== RETURN ========
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});