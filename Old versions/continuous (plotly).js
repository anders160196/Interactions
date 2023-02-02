var outputArray;

//  ======== T-SNE ========
import features from '/features.json' assert {type: 'json'};

function calculateTSNE(dimensions, playlist) {
  var opt = {}
  opt.epsilon = 10; // epsilon is learning rate (10 = default)
  opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
  opt.dim = dimensions; // dimensionality of the embedding (2 = default)
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
}

calculateTSNE(3, 'Top Songs')




//  ======== PLOTLY ========
const X = [];
const Y = [];
const Z = [];
const NAME = [];

function generate3DPlot() {
  outputArray.forEach((point, index) => {
    X.push(point[0]);
    Y.push(point[1]);
    Z.push(point[2]);
    NAME.push(Object.keys(features)[index]);
  });

  var trace1 = {
  	x: X,
    y: Y,
    z: Z,
  	mode: 'markers',
  	marker: {
  		size: 12,
  		line: {
  		color: 'rgba(217, 217, 217, 0.14)',
  		width: 0.5},
  		opacity: 0.8},
  	type: 'scatter3d'
  };
  
  var data = [trace1];
  
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
  	  
      },
    plot_bgcolor:'#f5fcff',
    paper_bgcolor:'#f5fcff',
  };
  
  Plotly.newPlot('myDiv', data, layout, {responsive: true});
}

function generate2DPlot() {
  var trace1 = {
    x: X,
    y: Y,
    mode: 'markers+text',
    type: 'scatter',
    name: 'Team A',
    text: NAME,
    textposition: 'top center',
    textfont: {
      family:  'Raleway, sans-serif'
    },
    marker: {
      size: 30,
      color: 'rgba(17, 157, 255,0.5)',
      line: {
        color: 'rgb(30, 170, 255)',
        width: 2
      }
    }
  };
  
  var data = [ trace1 ];
  
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
  
  Plotly.newPlot('myDiv', data, layout, {responsive: true});
}

generate3DPlot()


//  ======== SELECTIONS ========
//var selectMode = document.getElementById("mode");
//var selectDimensions = document.getElementById("dimensions");

document.addEventListener("change", function() {
  var mode = document.getElementById("mode").value;
  var dimensions = document.getElementById("dimensions").value;
  
  if (mode == "features") {
    document.getElementById("x").disabled = false;
    document.getElementById("y").disabled = false;
    if (dimensions != "2D") {
      document.getElementById("z").disabled = false;
    }
  }
  if (mode == "similarity") {
    document.getElementById("x").disabled = true;
    document.getElementById("y").disabled = true;
    document.getElementById("z").disabled = true;
  }
  
  if (dimensions == "3D" && mode == "similarity") {
    calculateTSNE(3, 'Top Songs')
    generate3DPlot()
  }
  if (dimensions == "2D" && mode == "similarity") {
    calculateTSNE(2, 'Top Songs')
    generate2DPlot()
  }
});


//  ======== AUDIO ========
var audio = new Audio();
var myPlot = document.getElementById('myDiv');
myPlot.on('plotly_click', function(data){
  var song = '';
  for(var i=0; i < data.points.length; i++){
      song = data.points[i].text;
  }
  console.log(song);
  audio.src = 'music/Top Songs - Global/' + song + '.wav';
  audio.play();
});

//  ======== RETURN ========
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});