var audio = new Audio();
var div = document.getElementById("populateMe");

// List of Songs
function listSongs(genre) {
  let button = document.createElement("button");
  button.className = "button-big";
  button.innerHTML = "↩";
  button.onclick = function () {
    div.replaceChildren();
    listGenres(genre);
    div.style.textAlign = "center";
  };
  div.appendChild(button);
  
  for (let song of genre['children']) {
    //console.log(i)
    let button = document.createElement("button");
    button.className = "button-big";
    button.innerHTML = song['name'].replace('.wav','');
    button.onclick = function () {
      audio.src = 'music/genres/' + genre['name'] + '/' + song['name'];
      audio.play();
    };
    div.appendChild(button);
  }
}

// List of Genres
function listGenres() {
  for (let genre of index['children']) {
    let button = document.createElement("button");
    button.className = "button-square";
    button.innerHTML = genre['name'];
    button.onclick = function () {
      div.replaceChildren();
      listSongs(genre);
      div.style.textAlign = "left";
    };
    //div.appendChild(button);
  }
}

//import index from '/index.json' assert {type: 'json'};
var index;
async function loadData() {
  index = await import('/index.json', {assert: {type: 'json'}}).then(module => module.default);
  //console.log(index);
  listGenres();
}

loadData();

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});