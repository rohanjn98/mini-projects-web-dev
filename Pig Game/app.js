var scores, roundScore, activePlayer, gamePlaying;

var dice1DOM = document.getElementById('dice-1');
var dice2DOM = document.getElementById('dice-2');

init()

function init () {
    // Set the initial scores to 0 --> Initial state of the game
    gamePlaying = true
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    document.getElementById('score-0').textContent = '0'
    document.getElementById('score-1').textContent = '0'
    document.getElementById('current-0').textContent = '0'
    document.getElementById('current-1').textContent = '0'
    
    // Dice -> invisible
    dice1DOM.style.display = 'none';
    dice2DOM.style.display = 'none';

    // Reset the name to PLAYER 1 and PLAYER 2
    document.getElementById('name-0').textContent = 'PLAYER 1'
    document.getElementById('name-1').textContent = 'PLAYER 2'
    document.querySelector('.player-0-panel').classList.remove('winner')
    document.querySelector('.player-1-panel').classList.remove('winner')
    document.querySelector('.player-0-panel').classList.remove('active')
    document.querySelector('.player-1-panel').classList.remove('active')
    document.querySelector('.player-0-panel').classList.add('active')
    document.querySelector('.final-score').value = null
}

function nextPlayer () {
    // Before changing player
    // previousDice = 7;
    dice1DOM.style.display = 'none';
    dice2DOM.style.display = 'none';
    roundScore = 0;
    document.querySelector('#current-' + activePlayer).textContent = roundScore; // 0
    document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
    
    // Change player
    activePlayer = activePlayer === 1 ? 0 : 1;
    
    // After changing player
    document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
}

// When roll dice clicked 
document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        // Generate random number
        var currentDice1 = Math.floor(Math.random() * 6) + 1;
        var currentDice2 = Math.floor(Math.random() * 6) + 1;

        // Make dice visible and set the req image
        dice1DOM.style.display = 'block';
        dice2DOM.style.display = 'block';
        dice1DOM.src = 'dice-' + currentDice1 + '.png'
        dice2DOM.src = 'dice-' + currentDice2 + '.png'

        if (currentDice1 === currentDice2) {
            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = '0';
            // Next player called with 2 sec timeout
            setTimeout(function(){ nextPlayer(); }, 1000);
        }        

        // Update the roundScore if the rolled number was not 1
        if (currentDice1 !== 1 && currentDice2 !== 1) {
            // Update score
            roundScore += currentDice1 + currentDice2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore; 
        } else {
            // Next player called with 2 sec timeout
            setTimeout(function(){ nextPlayer(); }, 1000);
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
        // Add roundScore to player's respective score
        scores[activePlayer] += roundScore

        // Update UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        // Check for winning score
        var input = document.querySelector('.final-score').value;
        var winningScore;
        if (input) {
            winningScore = input;
        } else {
            winningScore = 100;
        }
        
        // Check for win
        if (scores[activePlayer] >= winningScore) {
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
            dice1DOM.style.display = 'none';
            dice2DOM.style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            gamePlaying = false;
        } else {
            // Next Player called
            nextPlayer()
        }   
    }
});

document.querySelector('.btn-new').addEventListener('click', init)




