/**
 * Created by Daniel Brouillet.
 */


// These are the color of the gems, in order.
const white = 0;
const blue = 1;
const green = 2;
const red = 3;
const black = 4;
const gold = 5;

// The values are in the same order as the constants above.
const colorName = ["white", "blue", "green", "red", "black", "gold"];

function Card(cost, color, pointValue, imagePath) {
    // Cards costs are an array of integers for [White, Blue, Green, Red, Black] 
    this.cost = cost;
    this.color = color;
    this.pointValue = pointValue;
    this.imagePath = imagePath;
}

function Noble(requirements, imagePath) {
    // Requirements are an array of integers for [White, Blue, Green, Red, Black] needed to qualify for that noble.
    this.requirements = requirements;
    this.imagePath = imagePath;
}

function Player(name, isComputer) {
    this.name = name;
    this.isComputer = isComputer;
    this.gems = [0, 0, 0, 0, 0, 0];
    // Players keep track of the number of cards they own of each color.
    this.cards = [0, 0, 0, 0, 0];
    this.points = 0;
    // Currently not in use.
    this.reservedCards = [];
}

// List of players in the game.  These are instances of the Player class.
var players = [];
var turn = 0;
var round = 1;
var gemSelected = [0, 0, 0, 0, 0, 0];  // The list of gems that the player currently is trying to take.
var cardSelected = null;  // [Row, Col] of the selected card. Null represents unselected.
var activePlayer = null;
var cardsInPlay = [[], [], []];  // The cards currently available for purchase.

// These are the available gems in the bank [White, Blue, Green, Red, Black, Gold]
var bank = [7, 7, 7, 7, 7, 5];

// This array contains the most recent messages.
var messages = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "It is round 1."];

// Array of nobles
var nobles = [
    new Noble([4, 0, 0, 0, 4], "noble4.jpg"), 
    new Noble([4, 4, 0, 0, 0], "noble3.jpg"), 
    new Noble([0, 4, 4, 0, 0], "noble2.jpg"), 
    new Noble([0, 0, 4, 4, 0], "noble1.jpg"), 
    new Noble([0, 0, 0, 4, 4], "noble5.jpg"), 
    new Noble([3, 3, 3, 0, 0], "noble6.jpg"), 
    new Noble([3, 0, 0, 3, 3], "noble7.jpg"), 
    new Noble([0, 3, 3, 3, 0], "noble8.jpg"), 
    new Noble([3, 3, 0, 0, 3], "noble9.jpg"), 
    new Noble([0, 0, 3, 3, 3], "noble10.jpg")
];

var deck1 = [
    // Cards costs are defined [White, Blue, Green, Red, Black]
    new Card([1, 2, 1, 1, 0], black, 0, "splendor53.jpg"), 
    new Card([0, 0, 1, 3, 1], black, 0, "splendor54.jpg"), 
    new Card([0, 0, 0, 4, 0], blue, 1, "splendor55.jpg"), 
    new Card([1, 1, 1, 0, 1], red, 0, "splendor56.jpg"), 
    new Card([2, 0, 0, 2, 0], red, 0, "splendor57.jpg"), 
    new Card([0, 2, 1, 0, 0], red, 0, "splendor58.jpg"), 
    new Card([0, 1, 0, 2, 2], green, 0, "splendor59.jpg"), 
    new Card([0, 2, 0, 2, 0], green, 0, "splendor60.jpg"), 
    new Card([1, 1, 0, 1, 2], green, 0, "splendor61.jpg"), 
    new Card([3, 1, 0, 0, 1], white, 0, "splendor62.jpg"), 
    new Card([0, 0, 0, 2, 1], white, 0, "splendor63.jpg"), 
    new Card([2, 0, 1, 0, 2], red, 0, "splendor64.jpg"), 
    new Card([0, 0, 0, 0, 3], blue, 0, "splendor65.jpg"), 
    new Card([1, 0, 0, 0, 2], blue, 0, "splendor66.jpg"), 
    new Card([2, 2, 0, 1, 0], black, 0, "splendor67.jpg"), 
    new Card([2, 0, 2, 0, 0], black, 0, "splendor68.jpg"), 
    new Card([0, 0, 2, 1, 0], black, 0, "splendor69.jpg"), 
    new Card([0, 2, 0, 0, 2], white, 0, "splendor70.jpg"), 
    new Card([4, 0, 0, 0, 0], red, 1, "splendor71.jpg"), 
    new Card([0, 0, 0, 0, 4], green, 1, "splendor72.jpg"), 
    new Card([2, 1, 1, 0, 1], red, 0, "splendor73.jpg"), 
    new Card([0, 4, 0, 0, 0], black, 1, "splendor74.jpg"), 
    new Card([1, 1, 1, 1, 0], black, 0, "splendor75.jpg"), 
    new Card([0, 0, 4, 0, 0], white, 1, "splendor76.jpg"), 
    new Card([0, 1, 2, 1, 1], white, 0, "splendor77.jpg"), 
    new Card([1, 3, 1, 0, 0], green, 0, "splendor78.jpg"), 
    new Card([1, 1, 0, 1, 1], green, 0, "splendor79.jpg"), 
    new Card([0, 1, 3, 1, 0], blue, 0, "splendor80.jpg"), 
    new Card([1, 0, 1, 2, 1], blue, 0, "splendor81.jpg"), 
    new Card([0, 0, 2, 0, 2], blue, 0, "splendor82.jpg"), 
    new Card([0, 0, 3, 0, 0], black, 0, "splendor83.jpg"), 
    new Card([1, 0, 2, 2, 0], blue, 0, "splendor84.jpg"), 
    new Card([0, 2, 2, 0, 1], white, 0, "splendor85.jpg"), 
    new Card([1, 0, 1, 1, 1], blue, 0, "splendor86.jpg"), 
    new Card([2, 1, 0, 0, 0], green, 0, "splendor87.jpg"), 
    new Card([3, 0, 0, 0, 0], red, 0, "splendor88.jpg"), 
    new Card([0, 3, 0, 0, 0], white, 0, "splendor89.jpg"), 
    new Card([0, 0, 0, 3, 0], green, 0, "splendor90.jpg"), 
    new Card([0, 1, 1, 1, 1], white, 0, "splendor91.jpg"), 
    new Card([1, 0, 0, 1, 3], red, 0, "splendor92.jpg")
];

var deck2 = [
    // Cards costs are defined [White, Blue, Green, Red, Black]
    new Card([3, 2, 2, 0, 0], black, 1, "splendor22.jpg"), 
    new Card([3, 0, 2, 0, 2], black, 1, "splendor23.jpg"), 
    new Card([5, 0, 0, 0, 0], black, 2, "splendor24.jpg"), 
    new Card([0, 0, 5, 3, 0], black, 2, "splendor25.jpg"), 
    new Card([0, 1, 4, 2, 0], black, 2, "splendor26.jpg"), 
    new Card([0, 0, 0, 0, 6], black, 3, "splendor27.jpg"), 
    new Card([0, 3, 0, 2, 3], red, 1, "splendor28.jpg"), 
    new Card([2, 0, 0, 2, 3], red, 1, "splendor29.jpg"), 
    new Card([3, 0, 0, 0, 5], red, 2, "splendor30.jpg"), 
    new Card([1, 4, 2, 0, 0], red, 2, "splendor31.jpg"), 
    new Card([0, 0, 0, 0, 5], red, 2, "splendor32.jpg"), 
    new Card([0, 0, 0, 6, 0], red, 3, "splendor33.jpg"), 
    new Card([2, 3, 0, 0, 2], green, 1, "splendor34.jpg"), 
    new Card([3, 0, 2, 3, 0], green, 1, "splendor35.jpg"), 
    new Card([4, 2, 0, 0, 1], green, 2, "splendor36.jpg"), 
    new Card([0, 0, 5, 0, 0], green, 2, "splendor37.jpg"), 
    new Card([0, 5, 3, 0, 0], green, 2, "splendor38.jpg"), 
    new Card([0, 0, 6, 0, 0], green, 3, "splendor39.jpg"), 
    new Card([0, 2, 3, 0, 3], blue, 1, "splendor40.jpg"), 
    new Card([0, 2, 2, 3, 0], blue, 1, "splendor41.jpg"), 
    new Card([5, 3, 0, 0, 0], blue, 2, "splendor42.jpg"), 
    new Card([0, 5, 0, 0, 0], blue, 2, "splendor43.jpg"), 
    new Card([2, 0, 0, 1, 4], blue, 2, "splendor44.jpg"), 
    new Card([0, 6, 0, 0, 0], blue, 3, "splendor45.jpg"), 
    new Card([2, 3, 0, 3, 0], white, 1, "splendor46.jpg"), 
    new Card([0, 0, 3, 2, 2], white, 1, "splendor47.jpg"), 
    new Card([0, 0, 1, 4, 2], white, 2, "splendor48.jpg"), 
    new Card([0, 0, 0, 5, 0], white, 2, "splendor50.jpg"), 
    new Card([0, 0, 0, 5, 3], white, 2, "splendor49.jpg"), 
    new Card([6, 0, 0, 0, 0], white, 3, "splendor51.jpg")
];

var deck3 = [
    // Cards costs are defined [White, Blue, Green, Red, Black]
    new Card([3, 3, 5, 3, 0], black, 3, "splendor17.jpg"), 
    new Card([0, 0, 0, 7, 0], black, 4, "splendor18.jpg"), 
    new Card([0, 0, 3, 6, 3], black, 4, "splendor20.jpg"), 
    new Card([0, 0, 0, 7, 3], black, 5, "splendor19.jpg"), 
    new Card([3, 5, 3, 0, 3], red, 3, "splendor16.jpg"), 
    new Card([0, 3, 6, 3, 0], red, 4, "splendor15.jpg"), 
    new Card([0, 0, 7, 0, 0], red, 4, "splendor14.jpg"), 
    new Card([0, 0, 7, 3, 0], red, 5, "splendor13.jpg"), 
    new Card([5, 3, 0, 3, 3], green, 3, "splendor12.jpg"), 
    new Card([0, 7, 0, 0, 0], green, 4, "splendor11.jpg"), 
    new Card([3, 6, 3, 0, 0], green, 4, "splendor10.jpg"), 
    new Card([0, 7, 3, 0, 0], green, 5, "splendor9.jpg"), 
    new Card([7, 3, 0, 0, 0], blue, 5, "splendor8.jpg"), 
    new Card([6, 3, 0, 0, 3], blue, 4, "splendor7.jpg"), 
    new Card([7, 0, 0, 0, 0], blue, 4, "splendor6.jpg"), 
    new Card([3, 0, 3, 3, 5], blue, 3, "splendor5.jpg"), 
    new Card([0, 3, 3, 5, 3], white, 3, "splendor4.jpg"), 
    new Card([0, 0, 0, 0, 7], white, 4, "splendor3.jpg"), 
    new Card([3, 0, 0, 3, 6], white, 4, "splendor1.jpg"), 
    new Card([3, 0, 0, 0, 7], white, 5, "splendor2.jpg")
];


function shuffleDecksDealCards() {
    shuffleArray(deck1);
    shuffleArray(deck2);
    shuffleArray(deck3);
    shuffleArray(nobles);
    nobles = nobles.slice(0, 5);
    for (var i = 0; i < 4; i++) {
        cardsInPlay[0].push(deck1.pop());
        cardsInPlay[1].push(deck2.pop());
        cardsInPlay[2].push(deck3.pop());
    }
}

// Function for initializing the UI
function initializeGame() {
    createPlayers();
    shuffleDecksDealCards();
    // The game only shows the board after the initial createPlayers dialog is complete.
    document.getElementsByTagName("body")[0].style.visibility ="visible";
    populateAvailableCardsHTMLTable();
    populateAvailableNoblesHTMLTable();
    populateBankHTMLTable();

    activePlayer = players[0];
    activePlayer.startTurn();
}

// Creates the players and adds them to the players array.
function createPlayers() {
    var numberPlayers = -1;
    while (numberPlayers > 4 || numberPlayers < 1) {
        numberPlayers = prompt("How many players do you want? (1-4)");
    }
    var numberAI = -1;
    while (numberAI > numberPlayers || numberAI < 0) {
        numberAI = prompt("How many of those should be computer players?");
    }
    for (var c = 0; c < numberPlayers; c++) {
        if (c < numberAI) {
            players.push(new Player("AI " + c, true))
        } else {
            players.push(new Player(prompt("Enter the name of the next player."), false))
        }
    }
    shuffleArray(players);
}

function populateAvailableCardsHTMLTable() {
    var table = document.getElementById("availableCards");
    if (table != null) {
        for (var i = 0; i < table.rows.length; i++) {
            var row = table.rows[i];
            var deckIndex = table.rows.length - i - 1;
            for (var j = 0; j < row.cells.length; j++) {
                row.cells[j].innerHTML = '<img src="' + cardsInPlay[deckIndex][j].imagePath + '" width="125px">';
                row.cells[j].style.border = "medium solid white";
                row.cells[j].onclick = makeClickedOnCardCallback(deckIndex, j)
            }
        }
    }
}

function populateAvailableNoblesHTMLTable() {
    var table = document.getElementById("availableNobles");
    if (table != null) {
        var row = table.rows[0];
        for (var i = 0; i < row.cells.length; i++) {
            row.cells[i].innerHTML = '<img src="' + nobles[i].imagePath + '" width="150px">';
        }
    }
}

function populateBankHTMLTable() {
    var table = document.getElementById("bank");
    if (table != null) {
        var row = table.rows[0];
        for (var i = 0; i < row.cells.length; i++) {
            row.cells[i].onclick = makeClickedOnBankCallback(i);
        }
        updateBankUI()
    }
}

// Closure helpers for table initialization.
function makeClickedOnCardCallback(row, col) {
    return function() {
        clickedOnCard(row, col)
    }
}
function makeClickedOnBankCallback(row) {
    return function() {
        clickedOnBank(row)
    }
}

// Shuffles an array.
function shuffleArray(array) {
    for (var i = 0; i < array.length; i++) {
        var index = Math.floor(Math.random() * array.length);
        var temp = array[index];
        array[index] = array[i];
        array[i] = temp
    }
}

// Updates the message log. Displays the new log.
function sendMessage(text) {
    messages.shift();
    messages.push(text);
    var table = document.getElementById("messageLog");
    if (table != null) {
        for (var i = 0; i < table.rows.length; i++) {
            var row = table.rows[i];
            row.cells[0].innerHTML = messages[i];
        }
    }
}

// Function for updating the active player's stats.
function updateUIForActivePlayer() {
    var table = document.getElementById("activePlayer");
    if (table != null) {
        var row1 = table.rows[1];
        for (var h = 0; h < 6; h++) {
            row1.cells[h].innerHTML = activePlayer.gems[h];
        }
        row1.cells[6].innerHTML = activePlayer.name;
        var row2 = table.rows[2];
        for (var i = 0; i < 5; i++) {
            row2.cells[i].innerHTML = activePlayer.cards[i];
        }
        row2.cells[5].innerHTML = activePlayer.points;
    }
}

// Function for updating the playerDetails table which contains the stats for all players.
function updateUIPlayerDetails() {
    var table = document.getElementById("playerDetails");
    if (table != null) {
        for (var person = 0; person < players.length; person++) {
            // The first row of the table contains the images for each gem type.
            // Every two rows after that contains first a players chips,
            // then their cards and points, as well as the name.
            var chipsRow = table.rows[(person*2)+1];
            for (var i = 0; i < 6; i++) {
                chipsRow.cells[i].innerHTML = players[person].gems[i];
            }
            chipsRow.cells[6].innerHTML = players[person].name;
            var cardsRow = table.rows[(person*2)+2];
            for (var j = 0; j < 5; j++) {
                cardsRow.cells[j].innerHTML = players[person].cards[j];
            }
            cardsRow.cells[5].innerHTML = players[person].points;
        }
    }
}


// Function for updating the bank.
function updateBankUI() {
    var table = document.getElementById("bank");
    if (table != null) {
        var row = table.rows[0];
        var row2 = table.rows[1];
        for (var i = 0; i < row.cells.length; i++) {
            // The border color around each gem is changed to indicate the number selected.
            if (gemSelected[i] == 0) {
                row.cells[i].style.border = "medium solid white";
            } else if (gemSelected[i] == 1) {
                row.cells[i].style.border = "medium solid blue";
            } else if (gemSelected[i] == 2) {
                row.cells[i].style.border = "medium solid cyan";
            }
            row2.cells[i].innerHTML = bank[i]
        }
    }
}

// Function for updating the nobles.
function updateNobleUI() {
    var table = document.getElementById("availableNobles");
    if (table != null) {
        var row = table.rows[0];
        for (var i = 0; i < 5; i++) {
            row.cells[i].innerHTML = "";
        }
        for (var j = 0; j < nobles.length; j++) {
            row.cells[j].innerHTML = '<img src="' + nobles[j].imagePath + '" width="150px">';
        }

    }
}

// Function that executes when a card is clicked on.
function clickedOnCard(row, col) {
    // Clicking on the same card again deselects it.
    if (cardSelected != null && cardSelected[0] == row && cardSelected[1] == col) {
        cardSelected = null;
    } else if (activePlayer.canBuyCard(cardsInPlay[row][col])) {
        cardSelected = [row, col];
        gemSelected = [0, 0, 0, 0, 0, 0];
    } else {
        alert("You cannot afford that card.")
    }
    updateBankUI();
    activePlayer.highlightAffordableCards();
}

// Function that executes when the bank is clicked on. Allows for gem selection.
function clickedOnBank(col) {
    // In this function, anything that would increase the number of gems selected has checkChipOverflow called first.
    // If a player clicks on the bank after selecting a card to buy, they deselect the card.
    if (cardSelected != null) {
        cardSelected = null;
        activePlayer.highlightAffordableCards();
    }
    // If they selected gold, it either selects or deselects gold.
    if (col == gold) {
        if (gemSelected[gold] == 0) {
            gemSelected = [0, 0, 0, 0, 0, 0];
            if (activePlayer.checkChipOverflow()) {
                gemSelected = [0, 0, 0, 0, 0, 1];
            }
        } else if (gemSelected[gold] == 1) {
                gemSelected = [0, 0, 0, 0, 0, 0];
        }
    }
    // If three different gems have been selected, either deselect what they clicked on,
    // or no effect if they clicked on an unselected gem.
    else if (selectedGemCount() == 3) {
        if (gemSelected[col] == 1) {
            gemSelected[col] = 0
        }
    }
    // If there is a double selection, clicking on a different gem selects that gem instead,
    // and clicking on the same gem sets that gem back to one. In both cases, the result is 
    // that the only thing selected is one gem of the clicked type.
    else if (checkDoubleSelect()) {
        gemSelected = [0, 0, 0, 0, 0, 0];
        gemSelected[col] = 1;
    }
    else {
        // Since the player is selecting a regular gem, any selected gold must be deselected.
        gemSelected[gold] = 0;
        // If the clicked gem has already been selected and only one gem has been selected,
        // the player is trying to double-select it.
        if (gemSelected[col] == 1 && selectedGemCount() == 1) {
            // Players are not allowed to take two gems from a stack with less than four gems in it.
            if (bank[col] >= 4) {
                if (activePlayer.checkChipOverflow()) {
                    gemSelected[col] = 2;
                }
            } else {
                alert("You can only take two gems from a stack with at least four gems in it.")
            }
        }
        // If the clicked gem has already been selected and multiple gems have been selected,
        // then the player is trying to deselect it.
        else if (gemSelected[col] == 1) {
            gemSelected[col] = 0;
        }
        // Otherwise, the player is just selecting a gem.
        else if (activePlayer.checkChipOverflow()) {
            gemSelected[col] = 1;
        }
    }
    for (var i = 0; i < gemSelected.length; i++) {
        if (gemSelected[i] > bank[i]) {
            gemSelected[i] = 0;
            alert("You can't take " + colorName[i] + " because there aren't any left in the bank.")
        }
    }
    updateBankUI()
}

// Helper function for clickedOnBank - Returns true if 2 of the same gem are selected.
function checkDoubleSelect() {
    for (var i = 0; i < gemSelected.length; i++) {
        if (gemSelected[i] == 2) {
            return true
        }
    }
    return false
}

// Helper function for clickedOnBank - Returns sum of number of gems selected.
function selectedGemCount() {
    var count = 0;
    for (var i = 0; i < gemSelected.length; i++) {
        count += gemSelected[i]
    }
    return count;
}

// Executes "Done" Button when it is clicked.
function doneButtonClicked() {
    if (cardSelected != null) {
        activePlayer.buyCard(cardsInPlay[cardSelected[0]][cardSelected[1]]);
        drawNewCard(cardSelected[0], cardSelected[1]);
    } else {
        activePlayer.takeGems()
    }
    activePlayer.endTurn()
}

// Function to replace a card.
function drawNewCard(row, col) {
    var table = document.getElementById("availableCards");
    var newCard = '';
    if (row == 0) {
        newCard = deck1.pop();
    }
    else if (row == 1) {
        newCard = deck2.pop();
    }
    else {
        newCard = deck3.pop();
    }
    cardsInPlay[row][col] = newCard;
    var newHTML = '';
    if (newCard != undefined) {
        newHTML = '<img src="' + cardsInPlay[row][col].imagePath + '" width="125px">';
    } else {
        sendMessage("Deck " + (1 + row) + " has been exhausted.")
    }
    table.rows[2 - row].cells[col].innerHTML = newHTML;
}

// Determines who the winning player is.
function determineWinner() {
    var maxPoints = 15;
    var minCards = 300;
    var winnerNames = null;
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var numCards = player.cards.reduce(function(a, b) {return a + b});
        if ((player.points > maxPoints) ||
            (player.points == maxPoints && numCards < minCards)) {
            minCards = numCards;
            maxPoints = player.points;
            winnerNames = [player.name];
        } else if (player.points == maxPoints && numCards == minCards) {
            winnerNames.push(player.name);
        }
    }
    if (winnerNames == null) {
        return;
    }
    if (winnerNames.length == 1) {
        sendMessage(winnerNames[0] + " wins with " + maxPoints + " points and " + minCards + " cards, on Round " + round + "!")
    } else {
        sendMessage("The game is a tie between Players " + winnerNames.join(", "))
    }
}

// Starts the turn for a player.
Player.prototype.startTurn = function() {
    updateUIForActivePlayer();
    updateUIPlayerDetails();
    updateBankUI();
    sendMessage("It is " + this.name + "'s turn.");
    this.highlightAffordableCards();
    if (this.isComputer == true) {
        this.AITakeTurn()
    }
};

// Helper function to prevent player from taking too many gems - returns false if has 10 or more gems between player and selected
Player.prototype.checkChipOverflow = function() {
    var count = 0;
    for (var i = 0; i < gemSelected.length; i++) {
        count += (this.gems[i] + gemSelected[i])
    }
    if (count >= 10) {
        alert("You are trying to take too many gems!")
    }
    return (count < 10)
};

// Player pulls gems --- prevents the bank supply from going negative.
// Rule enforcement for taking two of the same color is done elsewhere
Player.prototype.takeGems = function() {
    var message = this.name + " took";
    for (var i = 0; i < bank.length; i++) {
        if (gemSelected[i] <= bank[i]) {
            this.gems[i] += gemSelected[i];
            bank[i] -= gemSelected[i];
            if (gemSelected[i] == 1) {
                message += " " + colorName[i] + ",";
            }
            if (gemSelected[i] == 2) {
                message += " two " + colorName[i] + ",";
            }
        }
    }
    message = message.substring(0, message.length - 1);
    message += ".";
    if (selectedGemCount() == 0) {
        sendMessage(this.name + " took nothing.")
    } else {
        sendMessage(message);
    }
    gemSelected = [0, 0, 0, 0, 0, 0];
    updateBankUI()
};

// Changes the border colors around each card in cardsInPlay based on if the active player
// can afford those cards. White -> Unaffordable, Green -> Affordable, Blue -> Selected and Affordable
Player.prototype.highlightAffordableCards = function() {
    var table = document.getElementById("availableCards");
    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        for (var j = 0; j < row.cells.length; j++) {
            if ((cardSelected != null) && (cardSelected[0] == 2-i && cardSelected[1] == j)) {
                row.cells[j].style.border = "medium solid blue";
            } else if (cardsInPlay[2-i][j] != undefined && this.canBuyCard(cardsInPlay[2-i][j])) {
                    row.cells[j].style.border = "medium solid green";
            }
            else {
                row.cells[j].style.border = "medium solid white";
            }
        }
    }
};

// Returns true if the player is able to afford the given card, false otherwise.
Player.prototype.canBuyCard = function(card){
    var deficit = 0;
    for (var i = 0; i < 5; i++) {
        var gemDeficit = card.cost[i] - (this.cards[i] + this.gems[i]);
        if (gemDeficit > 0) {
            deficit += gemDeficit;
        }
    }
    return (deficit <= this.gems[gold])
};

// Spends the correct amount of gems to buy the card, adds to the card and point totals.
Player.prototype.buyCard = function(card){
    var deficit = 0;
    for (var i = 0; i < 5; i++) {
        var gemsNeeded = card.cost[i] - this.cards[i];
        if (gemsNeeded > 0) {
            var gemsUsed = Math.min(gemsNeeded, this.gems[i]);
            deficit += gemsNeeded - gemsUsed;
            this.returnGems(gemsUsed, i);
        }
    }
    this.returnGems(deficit, gold);
    this.cards[card.color]++;
    this.points += card.pointValue;
    updateBankUI();
    message = this.name + " purchased a " + colorName[card.color]  + " card";
    if (card.pointValue > 0) {
        message += " card worth " + card.pointValue + " points.";
    } else {
        message += ".";
    }
    sendMessage(message);
};

// Returns the players gems to the pool.
Player.prototype.returnGems = function (number, index){
    this.gems[index] -= number;
    bank[index] += number;
};

// Ends the turn, takes a noble if possible, increments the turn, checks if the game is over and determines winner,
// resetting global variables and updating the UI to prepare for the next turn.
Player.prototype.endTurn = function() {
    earnableNobles = this.canEarnNoble();
    if (earnableNobles.length > 0) {
        this.takeNoble(earnableNobles[0]);
        updateNobleUI()
    }
    turn += 1;
    if (turn == players.length) {
        var gameOver = false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].points >= 15) {
                gameOver = true
            }
        }
        if (gameOver) {
            determineWinner();
            updateUIForActivePlayer();
            updateUIPlayerDetails();
            return;
        } else {
            turn = 0;
            round += 1;
            sendMessage("&nbsp;");
            sendMessage("---- It is round " + round + ". ----");
        }
    }
    gemSelected = [0, 0, 0, 0, 0, 0];
    cardSelected = null;
    activePlayer = players[turn];
    activePlayer.startTurn()
};

// Returns an array of the nobles that player is eligible for. Returns false if there are none.
Player.prototype.canEarnNoble = function() {
    var eligible = [];
    for (var i in nobles) {
        var isEligible = true;
        for (var j = 0; j < 5; j++) {
            if (this.cards[j] < nobles[i].requirements[j]) {
                isEligible = false;
                break;
            }
        }
        if (isEligible) {
            eligible.push(i);
        }
    }
    return eligible;
};

// Gives the player a noble and removes it from the list of nobles.
Player.prototype.takeNoble = function(noble) {
    nobles.splice(noble, 1);
    this.points += 3;
    sendMessage(this.name + " earned a noble!")
};

// Takes the AI turn.
Player.prototype.AITakeTurn = function() {
    if (this.AIBuyCard()) {
        this.endTurn()
    } else {
        this.AITakeGems();
        this.endTurn();
    }
};

// Function that makes the AI buy a card. If it can afford one,
// it will buy one and return true. If it cannot, it returns false.
Player.prototype.AIBuyCard = function() {
    var listOfCards = this.AIlistAffordableCards();
    if (listOfCards.length == 0) {
        return false
    }
    listOfCards = this.AIKeepHighestPointValue(listOfCards);
    listOfCards = this.AIKeepCheapestCards(listOfCards);
    this.buyCard(listOfCards[0]);
    // Searches cards in play to replace the selected card.
    for (var row = 0; row < cardsInPlay.length; row++) {
        for (var col = 0; col < cardsInPlay[row].length; col++) {
            if (cardsInPlay[row][col] == listOfCards[0]) {
                drawNewCard(row,col);
                break;
            }
        }
    }
    return true
};

// Generates a list of cards the player is able to buy.
Player.prototype.AIlistAffordableCards = function() {
    var affordableCards = [];
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 4; col++) {
            if (cardsInPlay[row][col] != undefined) {
                if (this.canBuyCard(cardsInPlay[row][col])) {
                    affordableCards.push(cardsInPlay[row][col]);
                }
            }
        }
    }
    return affordableCards
};

// Filters the given list to include only the most valuable cards
Player.prototype.AIKeepHighestPointValue = function(affordableCards) {
    var out = [];
    // cardPointValue starts at five because it is the maximum value a card can have.
    for (var cardPointValue = 5; cardPointValue >= 0; cardPointValue--) {
        for (var i = 0; i < affordableCards.length; i++) {
            if (affordableCards[i].pointValue == cardPointValue) {
                out.push(affordableCards[i]);
            }
        }
        if (out.length != 0) {break}
    }
    return out
};

// Filters the given list to include only the cheapest cards
Player.prototype.AIKeepCheapestCards = function(affordableCards) {
    var cardCost = 0;
    var out = [];
    while (out.length == 0) {
        for (var i = 0; i < affordableCards.length; i++) {
            if (this.AICardCost(affordableCards[i]) == cardCost) {
                out.push(affordableCards[i])
            }
        }
        cardCost += 1
    }
    return out
};

// This function returns the number of gems needed to buy a card - used to help AI determine what is cheaper
Player.prototype.AICardCost = function(card) {
    total = 0;
    for (var i = 0; i < 5; i++) {
        total += Math.max(0, card.cost[i] - this.cards[i])
    }
    return total
};

// The function the AI uses to try to take gems.
Player.prototype.AITakeGems = function() {
    var gemCount = 0;
    var count = 0;
    var colorPreference = this.AIColorPreference();
    for (var i in this.gems) {
        gemCount += this.gems[i]
    }

    if (gemCount == 9) {
        if (bank[gold] != 0) {
            gemSelected[gold] += 1;
        }
    }

    var i = 0;
    while (gemCount + selectedGemCount() < 10 && selectedGemCount() < 3 && i <= 5) {
        if (bank[colorPreference[i]] != 0) {
            gemSelected[colorPreference[i]] += 1;
        }
        i += 1;
    }
    this.takeGems();
    return;
};

// Function to determine AI's color preference when taking gems.
Player.prototype.AIColorPreference = function() {
    var listOfCards = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (cardsInPlay[i][j] != undefined) {
                var c = cardsInPlay[i][j];
                listOfCards.push([c, activePlayer.AICardCost(c)]);
            }
        }
    }
    listOfCards.sort(function(a, b) {
        var x = a[1];
        var y = b[1];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    var colorPref = [];
    for (var index in listOfCards) {
        var c = listOfCards[index][0];
        for (var color = 0; color < 5; color++) {
            if (colorPref.indexOf(color) == -1 && c.cost[color] > 0) {
                colorPref.push(color)
            }
        }
        if (colorPref.length >= 5) {
            break;
        }
    }
    for (var i = 0; i < 5; i++) {
        if (colorPref.indexOf(i) == -1) {
            colorPref.push(i);
        }
    }
    return colorPref;
};
