let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let audio = new Audio();
let image_data_url = "";

//Uncomment for debugging and testing
//document.getElementById("result-label").style.visibility = "visible";

async function streaming() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;
};
streaming();

navigator.permissions.query({ name: "camera" }).then(res => {
  console.log(res.state);  
  if(res.state != "granted"){
      document.getElementById("message").innerHTML = "Please grant webcam permission and reload"
    }
  else {
    countdown();
  }
});


async function detectEmotion() {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  image_data_url = canvas.toDataURL('image/jpeg');
  
  package = {
    "requests": [
      {
        "image": {
          "content": image_data_url.split(';base64,')[1]
        },
        "features": [
          {
            "maxResults": 1,
            "type": "FACE_DETECTION"
          }
        ]
      }
    ]
  }

  const response = await fetch(
    'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC-nat22FeiFBofvBtBPWfqVy4l6L4vFr0', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(package)
  })
  const json = await response.json();
  //console.log(json);
  
  if (json.responses[0].faceAnnotations === undefined) {
    document.getElementById("result-label").innerHTML = 'no face detected';
    document.getElementById("message").innerHTML = 'No face detected';
  }
  else {
    var detection = json.responses[0].faceAnnotations[0];
    var emotions = {
      'joy': detection.joyLikelihood,
      'sorrow': detection.sorrowLikelihood,
      'anger': detection.angerLikelihood,
      'surprise': detection.surpriseLikelihood
    };
    document.getElementById("result-label").innerHTML = 
      `Joy: ${emotions['joy']}<br>
      Sorrow: ${emotions['sorrow']}<br>
      Anger: ${emotions['anger']}<br>
      Surprise: ${emotions['surprise']}<br>`;

    var emotion;
    for (const score of ['POSSIBLE', 'LIKELY', 'VERY_LIKELY']) {
      for (const [key, value] of Object.entries(emotions)) {
        console.log(`${key}: ${value}`);
        if (value == score) {
          emotion = key;
        }
      }
    }
    
    console.log(emotion);
    
    var songs = {
      'joy': 'Pharrell Williams - Happy',
      'sorrow': 'Billie Eilish - lovely (with Khalid)',
      'anger': 'Lily Allen - Fuck You',
      'surprise': 'Ylvis - The Fox (What Does the Fox Say)'
    };

    if (emotion !== undefined) {
      audio.src = 'music/emotions/' + songs[emotion] + '.mp3';
      audio.play();
      document.getElementById("message").innerHTML = 'Emotion detected: ' + emotion.toUpperCase() + '<br><br>Now playing '+ songs[emotion];
    }
    else {
      document.getElementById("message").innerHTML = 'No emotion detected'
    }
  }
  
  document.getElementById("button").style.visibility = "visible";
}

function delay(milliseconds){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function countdown(){
  document.getElementById("message").innerHTML = 'Detecting emotional state... 3';
  await delay(1000);
  document.getElementById("message").innerHTML = 'Detecting emotional state... 2';
  await delay(1000);
  document.getElementById("message").innerHTML = 'Detecting emotional state... 1';
  await delay(1000);
  detectEmotion();
  
  let tracks = video.srcObject.getTracks();
  tracks.forEach((track) => {
    track.enabled = false;
  });
  
  video.style.display = "none";
  canvas.style.display = "block";
}


//  ======== RETURN ========
document.addEventListener("keyup", function(event) {
  console.log(event.keyCode);
  if (event.keyCode === 27) {  //27=ESC
    window.location.href='./index.html';
  }
});


//  ======== AGAIN ========
function again(){
  let tracks = video.srcObject.getTracks();
  tracks.forEach((track) => {
    track.enabled = true;
  });

  video.style.display = "block";
  canvas.style.display = "none";
  document.getElementById("button").style.visibility = "hidden";
  
  countdown();
}

document.addEventListener("keyup", function(event) {
  console.log(event.keyCode);
  if (event.keyCode === 13) {  //13=ENTER
    again();
  }
});