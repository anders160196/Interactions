var opt = {}
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 2; // dimensionality of the embedding (2 = default)
var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

import features from '/features.json' assert {type: 'json'};

var data = [];
for (let i in features) {
  var f = features[i];
  data.push([f['acousticness'], f['danceability'], f['energy'], f['instrumentalness'], f['liveness'], f['loudness'], f['speechiness'], f['tempo'], f['valence']]);
}
console.log(data);
tsne.initDataRaw(data);

for(var k = 0; k < 1500; k++) {
  tsne.step(); // every time you call this, solution gets better
}

var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot


var audio = new Audio();
var div = document.getElementById("populateMe");

let Xmax = 0;
let Xmin = 0;
let Ymax = 0;
let Ymin = 0;

for (let point of Y) {
  if (point[0] > Xmax) {
    Xmax = point[0];
  }
  if (point[0] < Xmin) {
    Xmin = point[0];
  }
  if (point[1] > Ymax) {
    Ymax = point[1];
  }
  if (point[1] < Ymin) {
    Ymin = point[1];
  }
}

Y.forEach((point, index) => {
  let x = (point[0]-Xmin)*(div.offsetWidth-150)/(Xmax-Xmin)+div.offsetLeft;
  let y = (point[1]-Ymin)*(div.offsetHeight-30)/(Ymax-Ymin)+div.offsetTop;
  name = Object.keys(features)[index];

  let button = document.createElement("button");
  button.innerHTML = name;
  button.className = "button-small";
  button.style.position = "absolute";
  button.style.left = x + "px";
  button.style.top = y + "px";
  button.style.width = "150px";
  button.style.height = "30px";
  button.onclick = function () {
    audio.src = 'music/Top Songs - Global/' + button.innerHTML + '.wav';
    audio.play();
  };
  div.appendChild(button);
});

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});