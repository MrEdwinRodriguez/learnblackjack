const blackjack = function () {
    return {
            suits: '♠︎ ♥︎ ♣︎ ♦︎'.split(' '),
            values: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
            push: 'Push',
            win: "Win",
            loss: "Loss",
            deck: [],
            players: [],
            currentGameOutcome: [],
            createDeck: function () {
                let deck = [];
                for (let i = 0 ; i < this.values.length; i++) {
                    for(let x = 0; x < this.suits.length; x++) {
                        let weight = parseInt(this.values[i]);
                        if (this.values[i] == "J" || this.values[i] == "Q" || this.values[i] == "K")
                            weight = 10;
                        if (this.values[i] == "A")
                            weight = 11;
                        const card = { value: this.values[i], suit: this.suits[x], weight: weight };
                        deck.push(card);
                    }
                }
                this.deck = deck;
            },
            shuffle: function () {
                for (let i = 0; i < 1000; i++) {
                    const location1 = Math.floor((Math.random() * this.deck.length));
                    const location2 = Math.floor((Math.random() * this.deck.length));
                    const tmp = this.deck[location1];
                    this.deck[location1] = this.deck[location2];
                    this.deck[location2] = tmp;
                }
            },
            createPlayers: function (num) {
                let players = [];
                for (let i = 1; i <= num; i++) {
                    const hand = new Array();
                    const player = { name: 'Player ' + i, id: i, Points: 0, hand: hand };
                    players.push(player);
                }
                this.players = players;
            },
            startblackjack: function (players) {
                let playerTotal = players || 2;
                // deal 2 cards to every player object
                // currentPlayer = 0;
                this.createDeck();
                this.shuffle();
                this.createPlayers(playerTotal);
                this.dealHands();
            },
            dealHands: function() {
                for(let  i = 0; i < 2; i++) {
                    for (let x = 0; x < this.players.length; x++) {
                        //card will have the card selected, pop will update the deck
                        var card = this.deck.pop();
                        this.players[x].hand.push(card);
                    }
                }
            },
            hit: function (player) {
                var card = this.deck.pop();
                this.players[player].hand.push(card);
            },
            dealerPlay: function () {
                let that = this;
                let dealer = this.players.slice(-1)[0];
                var dealerHandValue = dealer.hand.reduce(function(a, b){ 
                    return a.weight + b.weight;  
                })
                if (dealerHandValue == 21) {
                    const player = this.players[0];
                    let playerHandValue = player.hand.reduce(function(a, b){ 
                        return a.weight + b.weight;  
                    })
                    if ( dealerHandValue == playerHandValue && player.hand.length == 2 ) {
                        return "push";
                    } else {
                        return "Loss";
                    }
                }
                while (dealerHandValue <= 17) {
                    var card = this.deck.pop();
                    dealerHandValue = dealerHandValue + card.weight
                    that.players[this.players.length - 1].hand.push(card);
                }
   
                if (dealerHandValue > 21) {
                    const playerHand = this.getScore(0);
                    if (playerHand < 22 ) {
                        return "Win";
                    }
                } else {
                    return this.compareHands(dealerHandValue);
                }
            },
            compareHands: function (dealerScore) {
                const playerHandValue = this.getScore(0);
                if (dealerScore == playerHandValue ) {
                    this.currentGameOutcome.push(this.push);
                } else if (dealerScore > playerHandValue) {
                    this.currentGameOutcome.push(this.loss);
                } else {
                    this.currentGameOutcome.push(this.win);
                }
            },
            compareHandsWithSplit: function (dealerScore, playerIndex=0) {
                const player = this.players[playerIndex];
                let outcomes = ""
                if (player.hands) {
                    const playerHands = this.getScoreWithSplit(players.hands);
                    outcomes = playerHands.map(playerHand => {
                        if (dealerScore == playerHand  ) {
                            this.currentGameOutcome.push(this.push);
                        } else if (dealerScore > playerHand ) {
                            this.currentGameOutcome.push(this.loss);
                        } else {
                            this.currentGameOutcome.push(this.win);
                        }
                    })
                }
                this.currentGameOutcome = outcomes;
            },
            getScore: function (playerIndex) {
                const player = this.players[playerIndex];
                let playerHandValue = player.hand.reduce(function(a, b){ 
                    return a.weight + b.weight;  
                })
                return playerHandValue;
            },
            getScoreWithSplit: function (aHands) {
                const hands = aHands;
                return hands.map(hand  => {
                    return hand.reduce(function(a, b){ 
                        return a.weight + b.weight;  
                    })
                })
            },
            splitAce: function (playerIndex) {
                let player = this.players[playerIndex];
                let currentHand = player.hand; //array of cards
                player.hands = [
                    [currentHand[0]],
                    [currentHand[1]]
                ]
                const firstCard = this.deck.pop();
                this.players[playerIndex].hands[0].push(firstCard);                 
                const secondCard = this.deck.pop();
                this.players[playerIndex].hands[1].push(secondCard);
                this.dealerPlay();
                console.log(this)
            },
            split: function (playerIndex) {
                let player = this.players[playerIndex];
                let currentHand = player.hand; //array of cards
                player.hands = [
                    [currentHand[0]],
                    [currentHand[1]]
                ]
                const firstCard = this.deck.pop();
                this.players[playerIndex].hands[0].push(firstCard); 

            }
}    
}

export default blackjack;




