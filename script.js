let timer;
let timeLeft = 300; // 5 minutes in seconds
let isPaused = false;

const letters = [];
const generateV = document.getElementById('generateV');
const generateC = document.getElementById('generateC');
const resetB = document.getElementById('resetB');
const startB = document.getElementById('timerB');
const pauseB = document.getElementById('pauseB');
const resumeB = document.getElementById('resumeB');
const timerElement = document.getElementById('timer');
const lettersContainer = document.getElementById('letters');
const shuffleB = document.getElementById('shuffleB');

// --- optional: tiny helper styles for smooth FLIP animation ---
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #letters { position: relative; }
    #letters span {
      display: inline-block;          /* needed so transforms don't affect line layout weirdly */
      will-change: transform;
    }
    #letters span.floating {          /* subtle flourish during move */
      box-shadow: 0 .25rem .75rem rgba(0,0,0,.15);
    }
  `;
  document.head.appendChild(style);
})();

const vowelWeights = [
    { letter: 'A', weight: 8 },
    { letter: 'E', weight: 12 },
    { letter: 'I', weight: 7 },
    { letter: 'O', weight: 7 },
    { letter: 'U', weight: 3 }
];

const consonantWeights = [
    { letter: 'B', weight: 2 },
    { letter: 'C', weight: 3 },
    { letter: 'D', weight: 6 },
    { letter: 'F', weight: 2 },
    { letter: 'G', weight: 3 },
    { letter: 'H', weight: 3 },
    { letter: 'J', weight: 1 },
    { letter: 'K', weight: 3 },
    { letter: 'L', weight: 7 },
    { letter: 'M', weight: 4 },
    { letter: 'N', weight: 8 },
    { letter: 'P', weight: 2 },
    { letter: 'Q', weight: 1 },
    { letter: 'R', weight: 9 },
    { letter: 'S', weight: 9 },
    { letter: 'T', weight: 10 },
    { letter: 'V', weight: 2 },
    { letter: 'W', weight: 2 },
    { letter: 'X', weight: 1 },
    { letter: 'Y', weight: 4 },
    { letter: 'Z', weight: 1 }
];

resetB.addEventListener('click', resetLetters);
startB.addEventListener('click', startTimer);
pauseB.addEventListener('click', pauseTimer);
resumeB.addEventListener('click', resumeTimer);
generateC.addEventListener('click', () => generateLetters(false));
generateV.addEventListener('click', () => generateLetters(true));
shuffleB.addEventListener('click', shuffleLetters);

function getRandomLetter(weightedArray) {
    let totalWeight = weightedArray.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (let item of weightedArray) {
        if (randomNum < item.weight) return item.letter;
        randomNum -= item.weight;
    }
}

// Generate a unique letter (reduce duplicates)
function generateUniqueLetter(isVowel) {
    let letter, attempts = 0;
    const weightedArray = isVowel ? vowelWeights : consonantWeights;
    
    do {
        letter = getRandomLetter(weightedArray);
        attempts++;
    } while (letters.includes(letter) && attempts < 5);
    
    return letter;
}

function generateLetters(isVowel) {
    if (letters.length >= 9) return; // Prevent exceeding letter limit
    
    const letter = generateUniqueLetter(isVowel);
    letters.push(letter);
    
    lettersContainer.innerHTML += `<span class="${isVowel ? 'vowelMove' : 'consonantMove'}">${letter}</span>`;

    if (letters.length >= 9) {
        generateV.disabled = true;
        generateC.disabled = true;
        resetB.hidden = false;
        startB.hidden = false;
        shuffleB.hidden = false;
    }
}

function resetLetters() {
    letters.length = 0;
    generateV.disabled = false;
    generateC.disabled = false;
    lettersContainer.innerHTML = "";
    
    clearInterval(timer);
    timeLeft = 300;
    updateTimerDisplay();
    
    resetB.hidden = true;
    startB.hidden = false;
    pauseB.hidden = true;
    resumeB.hidden = true;
    shuffleB.hidden = true;
}

function startTimer() {
    if (timer) clearInterval(timer);
    isPaused = false;
    timer = setInterval(countdown, 1000);
    
    startB.hidden = true;
    resetB.hidden = true;
    pauseB.hidden = false;
    resumeB.hidden = true;
}

function pauseTimer() {
    clearInterval(timer);
    isPaused = true;
    
    pauseB.hidden = true;
    resumeB.hidden = false;
    resetB.hidden = false;
}

function resumeTimer() {
    if (isPaused) {
        timer = setInterval(countdown, 1000);
        isPaused = false;
    }
    
    resumeB.hidden = true;
    pauseB.hidden = false;
    resetB.hidden = true;
}

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        timerElement.textContent = '00:00';
        startB.hidden = true;
        pauseB.hidden = true;
        alert('Time is up!');
    } else {
        timeLeft--;
        updateTimerDisplay();
    }
}

function shuffleLetters() {
  const container = lettersContainer;
  const items = Array.from(container.children);
  if (items.length < 2) return;

  // 1) FIRST: capture current positions
  const firstRects = items.map(el => el.getBoundingClientRect());

  // 2) Make a shuffled copy of the current DOM nodes (Fisher–Yates)
  const shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3) Reorder the DOM to the new order
  shuffled.forEach(el => container.appendChild(el));

  // 4) LAST: capture new positions
  const lastRects = shuffled.map(el => el.getBoundingClientRect());

  // 5) INVERT: set each element's transform to the delta from where it WAS to where it IS
  shuffled.forEach((el, i) => {
    const oldIndex = items.indexOf(el);
    const dx = firstRects[oldIndex].left - lastRects[i].left;
    const dy = firstRects[oldIndex].top - lastRects[i].top;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    // remove any lingering transition so the jump to the inverted transform is instant
    el.style.transition = 'none';
  });

  // Force a reflow so the browser registers the transform
  void container.offsetWidth;

  // 6) PLAY: animate to the final position by removing the transform with a transition
  shuffled.forEach(el => {
    el.classList.add('floating');
    el.style.transition = 'transform 600ms ease, box-shadow 600ms ease';
    el.style.transform = '';
    el.addEventListener('transitionend', cleanupOnce);
  });

  // Keep the JS letters[] in sync with the new order
  syncLettersArrayFromDOM();
}

// Transition cleanup
function cleanupOnce(e) {
  const el = e.target;
  el.classList.remove('floating');
  // leave no inline transition so future shuffles can reapply cleanly
  el.style.transition = '';
  el.removeEventListener('transitionend', cleanupOnce);
}

// Keep letters[] matching the visual order (useful if you rely on it later)
function syncLettersArrayFromDOM() {
  const newOrder = Array.from(lettersContainer.children).map(el => el.textContent.trim());
  letters.length = 0;
  newOrder.forEach(ch => letters.push(ch));
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
