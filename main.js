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
});

// Create sparkles effect at a random position
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
    count: 5, // Number of sparkles
    size: 0.5,
    colors: ["#ff00ff", "#ffff00"],
  });

  setTimeout(() => document.body.removeChild(target), 1000); // Clean up
}

// Create confetti effect at a random position
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
    count: 5, // Number of confetti pieces
    size: 0.5,
    colors: ["#ff00ff", "#00ffff", "#ffff00"],
  });

  setTimeout(() => document.body.removeChild(target), 1000); // Clean up
}

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(256, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = function () {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);

      let values = 0;
      const length = array.length;
      for (let i = 0; i < length; i++) {
        values += array[i];
      }

      const average = values / length;

      // Ngưỡng để nhận diện tiếng thổi, có thể nâng cấp bằng cách dùng tần số đặc thù của tiếng thổi
      if (average > 150) {
        // Điều chỉnh ngưỡng này tùy ý
        const myDiv = document.querySelectorAll(".flame");
        if (myDiv) {
          myDiv.forEach((fire) => {
            fire.style.display = "none"; // Ẩn thẻ div
          });
          birthdaySong.play();
          ha.classList.add("active");
          hb.classList.add("active");
          document.body.removeChild(blow);
          setTimeout(triggerConfetti, 2000);
          setTimeout(triggerSparkles, 4000);
          setTimeout(triggerConfetti, 6000);
          setTimeout(triggerSparkles, 8000);
          setTimeout(triggerConfetti, 10000);
          setTimeout(triggerSparkles, 12000);
          birthdaySong.addEventListener("ended", ()=>
        {
            button.classList.add("active");
        })
        }
      } else if (average <=150 && average > 120) {
        const myDiv = document.querySelectorAll(".flame");
        if (myDiv) {
          myDiv.forEach((fire) => {
            fire.style.opacity = "0.5"; // Ẩn thẻ div
          });
        }
      } else if (average <= 120 && average > 100) {
        const myDiv = document.querySelectorAll(".flame");
        if (myDiv) {
          myDiv.forEach((fire) => {
            fire.style.opacity = "0.8"; // Ẩn thẻ div
          });
        }
      } else {
        const myDiv = document.querySelectorAll(".flame");
        if (myDiv) {
          myDiv.forEach((fire) => {
            fire.style.opacity = "1"; // Ẩn thẻ div
          });
        }
      }
    };
  })
  .catch((err) => console.error("Error accessing the microphone: ", err));
