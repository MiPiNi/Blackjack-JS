const suits = ["Clubs", "Spades", "Diamonds", "Hearts"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];

const dealerHandElement = document.querySelector("#dealerHand");
const playerHandElement = document.querySelector("#playerHand");
const playerScoreElement = document.querySelector("#playerScore");
const dealerScoreElement = document.querySelector("#dealerScore");
const dealerResultElement = document.querySelector("#dealerResult");
const playerResultElement = document.querySelector("#playerResult");
const buttons = document.querySelectorAll("#btn");

let playerHand = [];
let dealerHand = [];
let usedCards = [];

let playerScore = 0;
let dealerScore = 0;
let isFirstHand = null;

window.onload = () => {
	start();
};

function start() {
	//#region reset
	playerHand = [];
	dealerHand = [];
	usedCards = [];

	playerScore = 0;
	dealerScore = 0;
	isFirstHand = true;

	dealerHandElement.innerHTML = "";
	playerHandElement.innerHTML = "";
	dealerScoreElement.innerText = "";
	playerScoreElement.innerText = "";
	dealerResultElement.innerText = "Dealer";
	playerResultElement.innerText = "Player";

	buttons.forEach((element) => {
		element.disabled = false;
	});
	//#endregion

	if (dealerHand.length == 0) {
		let cardElement = createCard();
		dealerHand.push(cardElement.card);
		dealerHandElement.appendChild(cardElement.child);
		let emptyCard = document.createElement("div");
		emptyCard.className = "reversed";
		emptyCard.innerHTML =
			"<img src='imgs/Cards/reverse.png' style='width:120px; height:180px;margin:5px'>";
		dealerHandElement.appendChild(emptyCard);
	}
	while (playerHand.length < 2) {
		let cardElement = createCard();
		playerHand.push(cardElement.card);
		playerHandElement.appendChild(cardElement.child);
	}
	playerScore = checkScore(playerHand);
	playerScoreElement.innerText = `Score: ${playerScore}`;
	dealerScore = checkScore(dealerHand);
	dealerScoreElement.innerText = `Score: ${dealerScore}`;
	checkWin();
	isFirstHand = false;
}

function getCard() {
	let card = {
		suit: suits[Math.floor(Math.random() * 4)],
		value: values[Math.floor(Math.random() * 13)],
		img: () => {
			return `imgs/Cards/${card.suit}/${card.value}.png`;
		},
	};
	return card;
}

function createCard() {
	let child = document.createElement("div");
	let card = getCard();
	while (usedCards.includes([card.value, card.suit])) {
		card = getCard();
	}
	usedCards.push([card.value, card.suit]);
	child.className = "card";
	child.innerHTML = `<img src=${card.img()} style="width:120px; height:180px;margin:5px">`;
	return { card, child };
}

function checkScore(hand) {
	score = 0;
	hasAce = false;
	hand.forEach((element) => {
		if (element.value == "Ace") {
			score = hasAce ? score + 1 : score + 11;
			hasAce = true;
		} else if (isNaN(element.value)) {
			score += 10;
		} else {
			score += element.value;
		}
	});
	if (score > 21 && hasAce) {
		score -= 10;
	}
	return score;
}

function checkWin(standed = false) {
	if (dealerScore > 21 && playerScore > 21) {
		buttons.forEach((element) => {
			element.disabled = true;
		});
		playerResultElement.innerText = "Player ⚫";
		dealerResultElement.innerText = "Dealer ⚫";
		return true;
	} else if (
		playerScore > 21 ||
		(dealerScore > playerScore &&
			dealerScore <= 21 &&
			!isFirstHand &&
			standed)
	) {
		buttons.forEach((element) => {
			element.disabled = true;
		});
		playerResultElement.innerText = "Player ❌";
		dealerResultElement.innerText = "Dealer 🏆";
		return true;
	} else if (dealerScore > 21 || playerScore == 21) {
		buttons.forEach((element) => {
			element.disabled = true;
		});
		playerResultElement.innerText = "Player 🏆";
		dealerResultElement.innerText = "Dealer ❌";
		return true;
	}
	return false;
}

function hit() {
	let cardElement = createCard();
	playerHand.push(cardElement.card);
	playerHandElement.appendChild(cardElement.child);
	playerScore = checkScore(playerHand);
	playerScoreElement.innerText = `Score: ${playerScore}`;
	if (dealerHand.length < 2) {
		cardElement = createCard();
		dealerHand.push(cardElement.card);
		dealerHandElement.replaceChild(
			cardElement.child,
			document.querySelector(".reversed")
		);
		dealerScore = checkScore(dealerHand);
		dealerScoreElement.innerText = `Score: ${dealerScore}`;
	}
	checkWin();
}

function stand() {
	let cardElement = null;
	if (dealerHand.length < 2) {
		cardElement = createCard();
		dealerHand.push(cardElement.card);
		dealerHandElement.replaceChild(
			cardElement.child,
			document.querySelector(".reversed")
		);
		dealerScore = checkScore(dealerHand);
		dealerScoreElement.innerText = `Score: ${dealerScore}`;
		if (checkWin(true)) {
			return;
		}
	}
	while (!checkWin(true)) {
		cardElement = createCard();
		dealerHand.push(cardElement.card);
		dealerHandElement.appendChild(cardElement.child);
		dealerScore = checkScore(dealerHand);
		dealerScoreElement.innerText = `Score: ${dealerScore}`;
	}
}
