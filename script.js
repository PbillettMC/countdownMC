const letters = [];
const generateV = document.getElementById('generateV');
generateV.addEventListener('click', generateLetters);
generateV.myParam = 'Vow';
const generateC = document.getElementById('generateC');
generateC.addEventListener('click', generateLetters);
generateC.myParam = 'Con';
const resetB = document.getElementById('resetB');
resetB.addEventListener('click', resetLetters);
const timerB = document.getElementById('timerB');
timerB.addEventListener('click', startTimer);

function generateLetters(evt) {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = [
        'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
    ];

    if (evt.currentTarget.myParam == 'Vow') {
        const randomIndex = Math.floor(Math.random() * vowels.length);
        letters.push(vowels[randomIndex]);
    } else {
        const randomIndex = Math.floor(Math.random() * consonants.length);
        letters.push(consonants[randomIndex]);
    }
    
    document.getElementById('letters').innerText = letters.join('');
    $(".letters").lettering();
    $('div span').each(function() {
      var $span = $(this);
    });
    
  if (letters.length > 8) {
    generateV.disabled = true;
    generateC.disabled = true;
    resetB.hidden = false;
    timerB.hidden = false;
  }
}

function resetLetters(){
  letters.length = 0;
  resetB.hidden = true;
  timerB.hidden = true;
  generateV.disabled = false;
  generateC.disabled = false;
  document.getElementById('letters').innerText = "";
}

function startTimer(){
  resetB.hidden = true;
  timerB.hidden = true;
  var countDownDate = addMinutes(new Date(),5);
  var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s";

    // If the count down is over
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("timer").innerHTML = "TIME UP!";
    }
  }, 1000);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
