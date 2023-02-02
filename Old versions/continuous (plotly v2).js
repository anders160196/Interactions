var outputArray;

//  ======== T-SNE ========
import features from '/features.json' assert {type: 'json'};

var opt = {}
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 2; // dimensionality of the embedding (2 = default)
var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

var data = [];
for (let i in features) {
  var f = features[i];
  data.push([f['acousticness'], f['danceability'], f['energy'], f['instrumentalness'], f['liveness'], f['loudness'], f['speechiness'], f['tempo'], f['valence']]);
}
tsne.initDataRaw(data);

for(var k = 0; k < 1500; k++) {
  tsne.step(); // every time you call this, solution gets better
}

outputArray = tsne.getSolution(); // array of 2-D points that you can plot

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
  plot_bgcolor:'#f5fcff',
  paper_bgcolor:'#f5fcff',
};

for (let i = 0; i < outputArray.length; i++) { 
  outputArray[i].push(Object.keys(features)[i]);
}

outputArray.sort((a, b) => a[0] - b[0]);


// NEWEST TRIAL! .. doesn't work
/*
const plotData = [];
outputArray.forEach((point, index) => {
  var trace = {
    	x: point[0],
      y: point[1],
    	mode: 'markers+text',
      type: 'scatter',
      visible: false,
      text: point[2],
      textposition: 'top center',
    	textfont: {
        family:  'Raleway, sans-serif'
      },
      marker: {
        size: 30,
        line: {
          width: 2
        }
      }
  };

  if (index % 5 === 0) {
    trace.visible = true
  }
  
  plotData.push(trace);
});
*/

// PREVIOUS TRIAL
/*
const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
const subset = every_nth(outputArray, 5);

var X = [];
var Y = [];
var NAME = [];

subset.forEach((point, index) => {
  X.push(point[0]);
  Y.push(point[1]);
  NAME.push(point[2]);
});

var trace = {
  x: X,
  y: Y,
  mode: 'markers+text',
  type: 'scatter',
  name: 'Chunk F',
  hoverinfo: "y+name",
  text: NAME,
  textposition: 'top center',
  textfont: {
    family:  'Raleway, sans-serif'
  },
  marker: {
    size: 30,
    line: {
      width: 2
    }
  }
};

var plotData = [trace];
*/

//const plotData_all = {};



const plotData = [];
const chunkSize = 5;
var X_init = [];
var Y_init = [];
var NAME_init = [];

for (let i = 0; i < outputArray.length; i += chunkSize) {
  const chunk = outputArray.slice(i, i + chunkSize);
  console.log(i);

  X_init.push(chunk[2][0]);
  Y_init.push(chunk[2][1]);
  NAME_init.push(chunk[2][2]);

  var X = [];
  var Y = [];
  var NAME = [];
  
  chunk.forEach((point, index) => {
    X.push(point[0]);
    Y.push(point[1]);
    NAME.push(point[2]);
  });
  
  var trace = {
    x: X,
    y: Y,
    mode: 'markers+text',
    type: 'scatter',
    visible: 'legendonly',
    name: i,
    hoverinfo: "y+name",
    text: NAME,
    textposition: 'top center',
    textfont: {
      family:  'Raleway, sans-serif'
    },
    marker: {
      size: 30,
      color: 'rgba(17, 157, 255,0.5)',
      line: {
        width: 2
      }
    }
  };

  plotData.push(trace);
  //plotData_all[i] = trace;
}

var trace_init = {
  x: X_init,
  y: Y_init,
  mode: 'markers+text',
  type: 'scatter',
  name: 'Chunk Init',
  hoverinfo: "y+name",
  text: NAME_init,
  textposition: 'top center',
  textfont: {
    family:  'Raleway, sans-serif'
  },
  marker: {
    size: 30,
    line: {
      width: 2
    }
  }
};

plotData.push(trace_init);
//var plotData_init = [trace_init];

Plotly.newPlot('myDiv', plotData, layout, {responsive: true});


//  ======== AUDIO ========
var audio = new Audio();
var myPlot = document.getElementById('myDiv');

myPlot.on('plotly_hover', function(data){
  var song = '';
  for(var i=0; i < data.points.length; i++){
      song = data.points[i].text;
  }
  console.log(song);
  audio.src = 'music/Top Songs - Global/' + song + '.wav';
  audio.play();
});

myPlot.on('plotly_click', function(data){
  
  var song = '';
  for(var i=0; i < data.points.length; i++){
      song = data.points[i].text;
  }
  var result;
  for(var i = 0, len = outputArray.length; i < len; i++ ) {
      if( outputArray[i][2] === song ) {
          result = i;
          break;
      }
  }
  console.log(result)
  plotData[(result-2)/5].visible = true;
  plotData[10].visible = false;
  
  //Plotly.newPlot('myDiv', plotData, layout, {responsive: true});
  Plotly.animate('myDiv', {
    data: plotData,
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

myPlot.on('plotly_relayout', function(eventdata){

  outputArray.forEach((point, index) => {
    if (point[0] > eventdata['xaxis.range[0]'] && point[0] < eventdata['xaxis.range[1]']) {
      if (point[1] > eventdata['yaxis.range[0]'] && point[1] < eventdata['yaxis.range[1]']) {
        alert(point[2]);
      }
    }
  });

  //random subset, minimum 2
  var X = [];
  var Y = [];
  var NAME = [];
  
  subset.forEach((point, index) => {
    X.push(point[0]);
    Y.push(point[1]);
    NAME.push(point[2]);
  });
});

//  ======== RETURN ========
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});