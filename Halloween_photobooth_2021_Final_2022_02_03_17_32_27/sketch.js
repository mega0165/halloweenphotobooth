let video;
let poseNet;
let poses = [];
let bttn;
let click;
let counter = "";
let startingTime = 0;
let buttonPressed =false;
let currentOutfit = 1;

function preload() {
  hair = loadImage("dollHair.png");
  dress = loadImage("dollClothes.png");
  leftEye = loadImage("left_eye.png");
  rightEye = loadImage("right_eye.png");
  ladHair = loadImage ('ladHair.png');
  collar = loadImage ('collar.png');
  forehead = loadImage ('forehead.png');
  rightcheek = loadImage ('right_cheek.png');
  leftcheek = loadImage ('left_cheek.png');
  mouth = loadImage ('sourflip.png')
  img = loadImage("Halloween.png");
  click = loadSound("Click.mp3", soundLoaded);//preloading the sound
  count = loadSound("Count.mp3");
  scream = loadSound("Scream.wav");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  //poseNet.on("pose", gotPoses);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  bttn = createButton("Take Picture");
  bttn.position(200, 470);
  bttn.mousePressed(countDown);
  
  colBttn = createButton("Change Costume");
  colBttn.position(300, 470);
  colBttn.mousePressed(changeCostume);
  
   img2 = loadImage("CUTE.png");
  
  // bttn = createButton("Doll");
  // bttn.position(350,470);
  // bttn.mousePressed(dollBttn);
}

function countDown() {
  buttonPressed = true;
  startingTime = millis(); //how many millisenconds have passed
  setTimeout(takePic, 3200);
  
  //Countdown sound
  if (count.isPlaying()) {
    count.stop();
  } else {
    count.play();
  }
}
  
function takePic() {
  //camera sound, play if not playing, stop if playing
  if (click.isPlaying()) {
    click.stop();
  } else {
    click.play();
  }
  //save the canvas
  saveCanvas();
  buttonPressed = false;
}

function soundLoaded() {
  console.log("Happy Halloween!!");
}

function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

let tintValue;

function draw() {
  push();
  translate(width, 0); // move to top right corner
  scale(-1.0, 1.0); // flip x-axis backwards
  image(video, 0, 0);
  
  if (currentOutfit === 1) {
    drawDoll(); 
  } else if (currentOutfit === 2) {
    drawStickers();
  } else if (currentOutfit === 3) {
    drawLad();
  }
  image(img, 0, 0,640,480);
  pop()
   if (buttonPressed) {
    let timePassed = millis() - startingTime;
    if (timePassed < 1000) {
      counter = 3;
    } else if (timePassed < 2000) {
      counter = 2;
    } else if (timePassed < 3000) {
      counter = 1;
    } else {
      counter = "";
    }
     
     if (timePassed > 1200 && timePassed < 2500) {
      push();
      tintValue = 255 - map(timePassed, 1200, 2500, 0, 255);
      tint(255, tintValue);
      image(img2,0,0, 600, 500);
      if (!scream.isPlaying()) {
        scream.play();
      }
      pop();
    }
     
    text(counter, width/2, height/2);
    textSize(50);
  }
}



function drawDoll() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        if (keypoint.part === "rightShoulder") {
          image(dress, pose.rightShoulder.x - 125, pose.rightShoulder.y - 100, pose.leftShoulder.x - pose.rightShoulder.x + 250, 600);
        }
        else if (keypoint.part === "rightEar") {
          image(hair, pose.rightEar.x - 70, pose.rightEar.y - 180, 320, 330);
        }
        else if (keypoint.part === "rightEye") {
          image(leftEye, pose.rightEye.x - 30, pose.rightEye.y - 20, 65, 30);
          image(rightEye, pose.leftEye.x - 30, pose.leftEye.y - 20, 65, 30);
        }
      }
    }
  }
}

function drawStickers() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        if (keypoint.part === "nose") {
          image (forehead, pose.nose.x-80, pose.nose.y-150, 150, 100)
          image (mouth, pose.nose.x-50, pose.nose.y, 100, 80);
        }
        else if (keypoint.part === "rightEar") {
          image (leftcheek, pose.rightEar.x, pose.rightEar.y-20, 80, 80 );
        }
        else if (keypoint.part === "leftEar") {
          image (rightcheek, pose.leftEar.x - 70, pose.leftEar.y-20, 80, 80);
        }
      }
    }
  }
}

function drawLad() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        if (keypoint.part === "rightEar") {
          image (ladHair, pose.rightEar.x - 120, pose.rightEar.y - 220, 400, 400);}
          
        else if (keypoint.part === "rightShoulder") {
          image (collar, pose.rightShoulder.x - 50, pose.rightShoulder.y - 250, pose.leftShoulder.x - pose.rightShoulder.x+100, 400);
        }
      }
    }
  }
}

function changeCostume() {
  if (currentOutfit === 3) {
    currentOutfit = 1;
  } else {
    currentOutfit += 1;
  }
}
