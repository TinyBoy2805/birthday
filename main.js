const cube = document.querySelector(".cube");
const head_cube = document.querySelector(".head-gift");
const body_cube = document.querySelector(".body-gift");
const left = document.getElementById("left");
const right = document.getElementById("right");
const front = document.getElementById("front");
const back = document.getElementById("back");
const sparkleSound = new Audio("./sounds/sparkleSound.mp3");
const birthdaySong = new Audio("./sounds/birthdaySong.mp3");
const cake = document.querySelector(".cake");
const ha = document.querySelector("#ha");
const hb = document.querySelector("#hb");
const blow = document.getElementById("blow");
const button = document.querySelector("#button");
const card = document.querySelector("#card");
const card_container = document.querySelector("#card-container");
sparkleSound.volume = 1;
let isOpen = 0;

let isOff = 1;

card.addEventListener("click", ()=>
{
    card.classList.toggle("active");
})

button.addEventListener("click", ()=>
{
    document.body.removeChild(ha);
    document.body.removeChild(hb);
    document.body.removeChild(cake);
    button.style.display = "none";
    card_container.classList.add("active");
})


function clearHead() {
  cube.removeChild(head_cube);
}

function clearBody() {
  cube.removeChild(body_cube);
}

function showCake() {
  cake.style.display = "flex";
}

function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  document.querySelector(".night").appendChild(star);
}

for (let i = 0; i < 200; i++) {
  createStar();
}

let audioContext;
document.body.addEventListener('click', () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
});

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(async (stream) => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Tải AudioWorkletModule
    await audioContext.audioWorklet.addModule('processor.js');

    const microphone = audioContext.createMediaStreamSource(stream);
    const volumeNode = new AudioWorkletNode(audioContext, 'volume-processor');

    // Nhận dữ liệu từ bộ xử lý
    volumeNode.port.onmessage = (event) => {
      if(!isOpen) return; // Chỉ thu âm nếu hộp quà đã mở

      const average = event.data;

      console.log(`Average volume: ${average}`);

      const myDiv = document.querySelectorAll(".flame");
      if (myDiv.length > 0) {
        if (average > 60) { // Điều chỉnh ngưỡng âm thanh
          myDiv.forEach((fire) => {
            fire.style.display = "none";
          });
          birthdaySong.play();
          ha.classList.add("active");
          hb.classList.add("active");
          if (blow && blow.parentNode) {
            document.body.removeChild(blow);
          }
          setTimeout(triggerConfetti, 2000);
          setTimeout(triggerSparkles, 4000);
          setTimeout(triggerConfetti, 6000);
          setTimeout(triggerSparkles, 8000);
          setTimeout(triggerConfetti, 10000);
          setTimeout(triggerSparkles, 12000);
          birthdaySong.addEventListener("ended", () => {
            button.classList.add("active");
          });
        } else if (average <= 60 && average > 40) {
          myDiv.forEach((fire) => {
            fire.style.opacity = "0.5";
          });
        } else if (average <= 40 && average > 20) {
          myDiv.forEach((fire) => {
            fire.style.opacity = "0.8";
          });
        } else {
          myDiv.forEach((fire) => {
            fire.style.opacity = "1";
          });
        }
      }
    };

    microphone.connect(volumeNode);
    volumeNode.connect(audioContext.destination);
  })
  .catch((err) => {
    console.error("Error accessing the microphone: ", err);
    alert("Microphone access error: " + err.message);
  });

cube.addEventListener("click", () => {
  head_cube.classList.toggle("active");
  left.classList.toggle("active");
  right.classList.toggle("active");
  front.classList.toggle("active");
  back.classList.toggle("active");
  blow.classList.add("active");

  if (document.body.contains(head_cube)) {
    sparkleSound.play();
    party.confetti(head_cube, {
      count: party.variation.range(50, 100),
      spread: party.variation.range(40, 60),
      size: party.variation.skew(0.5, 1),
      colors: [
        "#FF5733",
        "#33FF57",
        "#3375FF",
        "#00D9FF",
        "#FF33A8",
        "#FFD433",
        "#33FFF3",
        "#FF8C33",
        "#A833FF",
        "#FF3380",
      ],
    });
  }
  setTimeout(clearHead, 500);
  setTimeout(clearBody, 500);
  setTimeout(showCake, 500);
  isOpen = 1;
});

// Tạo hiệu ứng sparkles tại vị trí ngẫu nhiên
function triggerSparkles() {
  const pos = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  };
  const target = document.createElement("div");
  target.style.position = "absolute";
  target.style.left = `${pos.x}px`;
  target.style.top = `${pos.y}px`;
  document.body.appendChild(target);

  party.sparkles(target, {
    count: 2, // Số lượng sparkles
    size: 0.5,
    colors: ["#ff00ff", "#ffff00"],
  });

  setTimeout(() => document.body.removeChild(target), 1000); // Dọn dẹp
}

// Tạo hiệu ứng confetti tại vị trí ngẫu nhiên
function triggerConfetti() {
  const pos = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  };
  const target = document.createElement("div");
  target.style.position = "absolute";
  target.style.left = `${pos.x}px`;
  target.style.top = `${pos.y}px`;
  document.body.appendChild(target);

  party.confetti(target, {
    count: 2, // Số lượng confetti
    size: 0.5,
    colors: ["#ff00ff", "#00ffff", "#ffff00"],
  });

  setTimeout(() => document.body.removeChild(target), 1000); // Dọn dẹp
}


