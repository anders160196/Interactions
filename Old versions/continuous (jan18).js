//  ======== T-SNE ========
import features from '/features.json' assert {type: 'json'}; //Must be 1 long combined array, so can feed into algorithm

var opt = {}
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 2; // dimensionality of the embedding (2 = default)
var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

var data = [];
for (let i in features) {
  var f = features[i];
  //console.log(i);
  //console.log(f);
  
  data.push([f['acousticness'], f['instrumentalness'], f['loudness'], f['speechiness'], f['tempo']]);
  //Available: f['acousticness'], f['danceability'], f['energy'], f['instrumentalness'], f['liveness'], f['loudness'], f['speechiness'], f['tempo'], f['valence']
}

var outputArray;
function runTSNE() {
  tsne.initDataRaw(data);
  
  for(var k = 0; k < 15000; k++) {
    tsne.step(); // every time you call this, solution gets better
  }
  outputArray = tsne.getSolution(); // array of 2-D points that you can plot 50-50-50ish?-50ish?

  for (let i = 0; i < outputArray.length; i++) { 
    outputArray[i].push(Object.keys(features)[i]); //maybe add genre to features?!
  }
}

runTSNE();

outputArray.sort((a, b) => a[0] - b[0]);

//  ======== PLOTLY ========

var layout = {
  xaxis: {
    autorange: true,
    showgrid: false,
    zeroline: false
  },
  yaxis: {
    autorange: true,
    showgrid: false,
    zeroline: false
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
};

var config = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['toImage', 'select2d', 'lasso2d', 'resetScale2d'],
  modeBarButtonsToAdd: [
    { name: 'Show all points',
      icon: Plotly.Icons.pencil,
      click: function(gd) {alert('Not yet programmed!')}
    }]
}

var plotData = [];

function traceAll() {
  var X = [];
  var Y = [];
  var NAME = [];
  
  outputArray.forEach((point, index) => {
    X.push(point[0]);
    Y.push(point[1]);
    NAME.push(point[2]);
  });
  
  var trace_all = {
    x: X,
    y: Y,
    mode: 'markers',
    type: 'scatter',
    name: 'all',
    hoverinfo: "text",
    text: NAME,
    //visible: 'legendonly',
    textposition: 'top center',
    textfont: {
      family:  'Raleway, sans-serif'
    },
    marker: {
      color: '#000066',
      size: 30,
      line: {
        width: 2
      }
    }
  };
  
  plotData.push(trace_all);
}

function traceSubset() {
  const interval = Math.floor(outputArray.length / 10)
  
  var X = [];
  var Y = [];
  var NAME = [];
  
  outputArray.forEach((point, index) => {
    if (index % interval === 0) {
      X.push(point[0]);
      Y.push(point[1]);
      NAME.push(point[2]);
    }
  });
  
  var trace_subset = {
    x: X,
    y: Y,
    mode: 'markers+text',
    type: 'scatter',
    name: 'subset',
    hoverinfo: "text",
    text: NAME,
    textposition: 'top center',
    textfont: {
      family:  'Raleway, sans-serif'
    },
    marker: {
      color: '#CC00CC',
      size: 30,
      line: {
        width: 2
      }
    }
  };

  plotData.push(trace_subset);
}

function traceNeighbors(selected) {
  var X = [];
  var Y = [];
  var NAME = [];

  var neighbors = [];
  
  outputArray.forEach((point, index) => {
    var distX = Math.abs(outputArray[selected][0] - point[0])
    var distY = Math.abs(outputArray[selected][1] - point[1])
    var Total = Math.sqrt(distX * distX + distY * distY)
    neighbors.push([Total, index]);
  });

  neighbors.sort((a, b) => a[0] - b[0]);
  neighbors = neighbors.slice(1, 5);
  neighbors = neighbors.map(n => n[1]);
  console.log(neighbors)

  outputArray.forEach((point, index) => {
    if (neighbors.includes(index)) {
      console.log(index);
      X.push(point[0]);
      Y.push(point[1]);
      console.log(point[2]);
      NAME.push(point[2]);
    }
  });
  
  var trace_neighbors = {
    x: X,
    y: Y,
    mode: 'markers+text',
    type: 'scatter',
    name: 'new',
    hoverinfo: "text",
    text: NAME,
    textposition: 'top center',
    textfont: {
      family:  'Raleway, sans-serif'
    },
    marker: {
      color: '#CC00CC',
      size: 30,
      line: {
        width: 2
      }
    }
  };
  
  plotData.push(trace_neighbors);
}

function traceSelected(selected) {
  var trace_selected = {
    x: [outputArray[selected][0]],
    y: [outputArray[selected][1]],
    mode: 'markers+text',
    type: 'scatter',
    name: 'selected',
    hoverinfo: "text",
    text: [outputArray[selected][2]],
    textposition: 'top center',
    textfont: {
      family:  'Raleway, sans-serif'
    },
    marker: {
      color: '#FF0000',
      size: 30,
      line: {
        width: 2
      }
    }
  };
  
  plotData.push(trace_selected);
}

traceAll();
traceSubset();
Plotly.newPlot('myDiv', plotData, layout, config);


//  ======== AUDIO ========
var audio = new Audio();
var myPlot = document.getElementById('myDiv');

myPlot.on('plotly_hover', function(data){
  var song = '';
  var trace = '';
  
  for(var i=0; i < data.points.length; i++){
    song = data.points[i].text;
    trace = data.points[i].data.name;
  }
  console.log(song);
  console.log(trace);
  if (trace != 'all') {
    audio.src = 'music/Classical/' + song + '.wav';
    audio.play();
  }
});

myPlot.on('plotly_click', function(data){
  var songName = '';
  for(var i=0; i < data.points.length; i++){
    songName = data.points[i].text;
  }
  var songIndex;
  for(var i = 0, len = outputArray.length; i < len; i++ ) {
      if( outputArray[i][2] === songName ) {
          songIndex = i;
          break;
      }
  }
  console.log("index: " + songIndex)
  console.log("song: " + outputArray[songIndex][2]);
  
  //runTSNE(); //re-runnig will result in bad transition behavior
  
  plotData = [];
  //traceAll();
  traceNeighbors(songIndex);
  traceSelected(songIndex);
  
  //Plotly.newPlot('myDiv', plotData, layout, {responsive: true});
  
  Plotly.animate('myDiv', {
    data: plotData,
    traces: [0, 1],
  }, {
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
  })
  
  
});



/*
myPlot.on('plotly_relayout', function(eventdata){
  outputArray.forEach((point, index) => {
    if (point[0] > eventdata['xaxis.range[0]'] && point[0] < eventdata['xaxis.range[1]']) {
      if (point[1] > eventdata['yaxis.range[0]'] && point[1] < eventdata['yaxis.range[1]']) {
        alert(point[2]);
      }
    }
  });
});
*/

//  ======== RETURN ========
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});