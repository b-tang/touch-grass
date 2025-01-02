let styleSheet = null;
const SPARK_ELEMENT_WIDTH = 30;
const DISTANCE = 40;
const RANDOMNESS_ON = true;
const milestones = [
  50, 100, 500, 1000, 10000, 50000, 100000, 500000, 1000000, 10000000,
];

function createTransformSteps() {
  if (Array.from(arguments).length === 0) {
    throw new Error("arguments to createTransformSteps should never be empty!");
  }

  const inputSteps = Array.from(arguments);
  const outputSteps = [inputSteps.shift()];
  inputSteps.forEach((step, i) => {
    outputSteps.push(`${outputSteps[i]} ${step}`);
  });

  return outputSteps;
}

const dynamicAnimation = (name, rotation) => {
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    document.head.appendChild(styleSheet);
  }

  const randomDist = RANDOMNESS_ON
    ? Math.floor((Math.random() - 0.5) * DISTANCE * 0.7)
    : 0;

  const [s1, s2, s3] = createTransformSteps(
    `translate(-50%, -50%) rotate(${rotation}deg) translate(10px, 0px)`,
    `translate(${DISTANCE + randomDist}px, 0px) scale(0.5, 0.5)`,
    `translate(${SPARK_ELEMENT_WIDTH / 2}px, 0) scale(0, 0)`
  );

  styleSheet.sheet.insertRule(
    `@keyframes ${name} {
       0% {
         transform: ${s1};
       }
       70% {
         transform: ${s2};
       }
       100% {
         transform: ${s3};
       }
    }`,
    styleSheet.length
  );
};

document.body.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  const center = { x: e.pageX, y: e.pageY };
  incrementClickCount();
  makeBurst(center);
});

const makeBurst = (center) => {
  for (let i = 0; i < 8; i++) {
    const randomSpace = RANDOMNESS_ON
      ? Math.floor(-17 + Math.random() * 34)
      : 0;
    makeSpark(center, 45 * i + randomSpace);
  }
};

const makeSpark = (center, rotation) => {
  const div = document.createElement("div");
  const aniName = `disappear_${rotation}`;
  dynamicAnimation(aniName, rotation);

  div.classList.add("spark");
  div.style.left = `${center.x}px`;
  div.style.top = `${center.y}px`;
  div.style.animation = `${aniName} 500ms ease-out both`;
  document.body.append(div);
  setTimeout(() => {
    document.body.removeChild(div);
  }, 1000);
};

const incrementClickCount = () => {
  let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;
  clickCount++;
  localStorage.setItem("clickCount", clickCount);
  checkMilestones(clickCount);
};

const milestoneMessages = {
  50: "wow, you've touched grass 50 times! :)",
  100: "amazing, you've touched grass 100 times! :D",
  500: "500 times!!! leave some grass for the rest of us.",
  1000: "alright slow down. 1000 times is the safe daily limit. back to your phone now.",
  10000: "you've touched grass 10,000 times (good job i guess)",
  50000:
    "50K! you did it! alright enough grass, go back home (or give your mouse some rest)",
  100000: "alright it's not even cool anymore. get some screen time...",
  500000:
    "idk what to make of 500,000 times of touching grass... but yayyy you did it.",
  1000000:
    "you've touched grass 1 MILLION times! phew! you may go home now, no more grass or milestones for you.",
  10000000: "why are you still here?...",
};

const checkMilestones = (clickCount) => {
  if (milestones.includes(clickCount)) {
    const message = milestoneMessages[clickCount];
    showMilestoneMessage(message);
    if (clickCount == 10000000) {
      location.href = "https://youtu.be/dQw4w9WgXcQ?si=hVsMtr3rG70VTCIx";
    }
  }
};

const showMilestoneMessage = (message) => {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("milestone-message");

  const text = document.createElement("span");
  text.innerText = message;

  const closeButton = document.createElement("button");
  closeButton.innerText = "×";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(messageDiv);
  });

  messageDiv.appendChild(text);
  messageDiv.appendChild(closeButton);
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    if (document.body.contains(messageDiv)) {
      document.body.removeChild(messageDiv);
    }
  }, 10000);
};
