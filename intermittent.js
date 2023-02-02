//import metadata from '/metadata.json' assert {type: 'json'};
var metadata;
async function loadData() {
  metadata = await import('/metadata.json', {assert: {type: 'json'}}).then(module => module.default);
}
loadData();


var audio = new Audio();
var div = document.getElementById("populateMe");

var page1 = document.getElementById("page1");
var page2 = document.getElementById("page2");
var page3 = document.getElementById("page3");

function showPlaylists() {
  var radioSelection = document.querySelector('input[type="radio"]:checked');
  var checkboxSelections = document.querySelectorAll('input[type="checkbox"]:checked');

  if (radioSelection == null || checkboxSelections.length == 0) {
    alert("Please select your age and favorite music genres.");
    return;
  }

  page1.style.display='none';
  page2.style.display='block';
  page3.style.display='none';

  var age = radioSelection.value;
  var genres = [];
  for (var element of checkboxSelections) {
    genres.push(element.id)
  }
  console.log(age, genres);

  buttons = document.querySelectorAll('button[class="button-square"]');
  
  for (var button of buttons) {
    if (genres.includes(button.value) || parseInt(age) >= button.value) {
      button.style.display='inline-block';
      button.onclick = showSongs;
    }
  }
}


// List of Songs
var playlist = '';
function showSongs(event) {
  page1.style.display='none';
  page2.style.display='none';
  page3.style.display='block';

  playlist = event.currentTarget.innerHTML;
  console.log(playlist);
  
  document.getElementById("playlistTitle").innerHTML = playlist;

  for (let song of metadata[playlist]) {
    console.log(song);
    let row = document.createElement("div");
    let icon = document.createElement("img");
    let title = document.createElement("p");
    let artist = document.createElement("p");
    let album = document.createElement("p");
    
    row.className = "row";
    row.tabIndex = -1;

    icon.className = "icon";  
    title.className = "title";
    artist.className = "artist";
    album.className = "album";

    title.innerHTML = song['title'];
    artist.innerHTML = song['artist'];
    album.innerHTML = song['album'];

    row.appendChild(icon);
    row.appendChild(title);
    row.appendChild(artist);
    row.appendChild(album);

    row.onmouseover = function() {
      if (row.className == "row-selected") {
        icon.src = "images/pause.png"
      }
      else {
        icon.src = "images/play.png"
      }
    };
    
    row.onmouseout = function() {
      if (row.className == "row-selected") {
        icon.src = "images/playing.png"
      }
      else {
        icon.src = ""
      }
    };
    
    var previousSelection = '';
    row.onclick = function() {
      if (row.className == "row-selected") {
        row.className = "row";
        icon.src = "images/play.png"
        audio.pause();
      }
      else {
        row.className = "row-selected";
        icon.src = "images/playing.png";
        console.log('music/playlists/' + playlist + '/' + song['title'] + '.wav');
        audio.src = 'music/playlists/' + playlist + '/' + song['title'] + '.wav';
        audio.play();
    
        previousSelection.className = "row";
        previousSelection = row;
      }
    };
    
    div.appendChild(row);
  }
}


function backToPlaylists() {
  audio.pause();
  div.innerHTML = '';
  page1.style.display='none';
  page2.style.display='block';
  page3.style.display='none';
}

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 27) {
    window.location.href='./index.html';
  }
});



