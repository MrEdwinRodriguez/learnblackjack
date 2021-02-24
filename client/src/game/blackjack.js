const blackjack = function () {
    return {
            suits: '♠︎ ♥︎ ♣︎ ♦︎'.split(' '),
            values: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
            push: 'Push',
            win: "Win",
            loss: "Loss",
            blackjack: "BlackJack",
            dealerblackjack: "Dealer Blackjack",
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
            createPlayers: function (num=2) {
                let new_players = [];
                for (let i = 1; i <= num; i++) {
                    const hand = new Array();
                    const player = { name: 'Player ' + i, id: i, Points: 0, hand: hand, hands: [] };
                    new_players.push(player);
                }
                this.players = new_players;
            },
            startblackjack: function (players) {
                let playerTotal = players || 2;
                this.createDeck();
                this.shuffle();
                this.createPlayers(playerTotal);
                this.dealHands();
                return { 
                    hasBlackJack: this.hasBlackJack(), 
                    playerHasDoubles: this.playerHasDoubles()
                }
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
            hit: function (player=0) {
                if (this.currentGameOutcome.length > 0 ) this.currentGameOutcome = [];
                var card = this.deck.pop();
                this.players[player].hand.push(card);
                var score = this.getScore(player, null);
                if (score == 21) {
                    this.dealerPlay();
                } else if (score > 21) {
                    this.currentGameOutcome = [this.loss]
                }
                return this.currentGameOutcome;
            },
            hitSplitHand: function (player, hand) {
                var card = this.deck.pop();
                this.players[player].hands[hand].push(card);
                var score = this.getScore(player, hand);
                if (score > 21 && this.currentGameOutcome.length == 0) {
                    this.currentGameOutcome = [this.loss];
                } else if (score > 21) {
                    this.currentGameOutcome.push(this.loss)
                }
            },
            double: function (playerIndex, handIndex) {
                const card = this.deck.pop(); 
                if (handIndex) {
                    this.players[playerIndex].hands[handIndex].push(card); 
                    const score = this.getScore(playerIndex, handIndex);
                    if (score > 21) {
                        this.currentGameOutcome = [this.loss];
                        return 'Loss';
                    } else {
                        this.dealerPlay();
                    }
                } else {
                    this.players[playerIndex].hand.push(card); 
                    const score = this.getScore(playerIndex, null);
                    if (score > 21) {
                        this.currentGameOutcome = [this.loss];
                        return 'Loss';
                    } else {
                        this.dealerPlay();
                    }
                }
            },
            hasBlackJack: function (player = 0) {
                const playerHand = this.getScore(player);
                const dealerHand = this.getScore(this.players.length -1);
                 if (playerHand == 21 && dealerHand == 21 ) {
                    this.currentGameOutcome = [this.push];
                     return true;
                 } else if (playerHand != 21 && dealerHand == 21 ) {
                     this.currentGameOutcome = [this.dealerblackjack];
                     return true;
                 } else if (playerHand == 21 && dealerHand != 21) {
                    this.currentGameOutcome = [this.blackjack];
                     return true;
                 } else {
                     return false;
                 }
            },
            playerHasDoubles: function (player=0) {
                if (this.players[player].hand[0].weight == this.players[player].hand[1].weight) return true;
                else return false
            },
            dealerPlay: function () {
                let that = this;
                let dealer = this.players.slice(-1)[0];
                var dealerHandValue = dealer.hand.reduce(function(a, b){ 
                    return a.weight + b.weight;  
                })
                if (dealerHandValue == 21 && dealer.hand.length == 2) {
                    const player = this.players[0];
                    let playerHandValue = player.hand.reduce(function(a, b){ 
                        return a.weight + b.weight;  
                    })
                    if ( dealerHandValue == playerHandValue && player.hand.length == 2 ) {
                        this.currentGameOutcome = [this.push];
                        return 'Push';
                    } else {
                        this.currentGameOutcome = [this.loss];
                        return "Loss";
                    }
                }
                while (dealerHandValue < 17) {
                    var card = this.deck.pop();
                    dealerHandValue = dealerHandValue + card.weight
                    that.players[this.players.length - 1].hand.push(card);
                }
                if (dealerHandValue >= 17 && dealerHandValue < 22) {
                    return this.compareHands(dealerHandValue);
                }
   
                if (dealerHandValue > 21) {
                    const playerHand = this.getScore(0);
                    if (playerHand < 22 ) {
                        this.currentGameOutcome = [this.win];
                        return "Win";
                    }
                } else {
                    return this.compareHands(dealerHandValue);
                }
            },
            dealerPlaySplit: function (playerIndex = 0) {
                let that = this;
                let dealer = this.players.slice(-1)[0];
                var dealerHandValue = dealer.hand.reduce(function(a, b){ 
                    return a.weight + b.weight;  
                })
                while (dealerHandValue < 17) {
                    var card = this.deck.pop();
                    dealerHandValue = dealerHandValue + card.weight
                    that.players[this.players.length - 1].hand.push(card);
                }
                if (dealerHandValue >= 17 && dealerHandValue < 32) {
                    for (let i=0; i<this.players[playerIndex].hands.length ; i++ ) {
                        const playerHandValue = this.getScore(0,i);
                        if (dealerHandValue == playerHandValue ) {
                            this.currentGameOutcome.push(that.push);
                        } else if (dealerHandValue > playerHandValue) {
                            this.currentGameOutcome.push(that.loss);
                        } else {
                            this.currentGameOutcome.push(that.win);
                        }
                    }
                }
            },
            compareHands: function (dealerScore) {
                const playerHandValue = this.getScore(0);
                if (dealerScore == playerHandValue ) {
                    this.currentGameOutcome = [this.push];
                    return this.push;
                } else if (dealerScore > playerHandValue) {
                    this.currentGameOutcome = [this.loss];
                    return this.loss;
                } else {
                    this.currentGameOutcome = [this.win];
                    return this.win;
                }
            },
            compareHandsWithSplit: function (dealerScore, playerIndex=0) {
                const player = this.players[playerIndex];
                let outcomes = ""
                if (player.hands) {
                    const playerHands = this.getScoreWithSplit(player.hands);
                    outcomes = playerHands.map(playerHand => {
                        if (dealerScore == playerHand  ) {
                            this.currentGameOutcome = [this.push];
                        } else if (dealerScore > playerHand ) {
                            this.currentGameOutcome = [this.loss];
                        } else {
                            this.currentGameOutcome = [this.win];
                        }
                    })
                }
            },
            getScore: function (playerIndex, handIndex) {
                const player = this.players[playerIndex];
                let playerHandValue = null;
                if (!isNaN(handIndex)) {
                    playerHandValue = player.hands[handIndex].reduce(function(total, currentValue){ 
                        let actualTotal = total && total.weight ? total.weight : total;
                        let weight = currentValue && currentValue.weight ? currentValue.weight : currentValue;
                        return actualTotal + weight;  
                    })
                } else {
                    playerHandValue = player.hand.reduce(function(total, currentValue){ 
                        let actualTotal = total && total.weight ? total.weight : total;
                        let weight = currentValue && currentValue.weight ? currentValue.weight : currentValue;
                        return actualTotal + weight;  
                    })
                }
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
                this.players[playerIndex].hand = [];
                this.dealerPlaySplit();
            },
            split: function (playerIndex) {
                let player = this.players[playerIndex];
                let currentHand = player.hand; //array of cards
                player.hands = [
                    [currentHand[0]],
                    [currentHand[1]]
                ]
                const firstCard = this.deck.pop();
                this.players[playerIndex].hand = [];
                this.players[playerIndex].hands[0].push(firstCard); 
            }
}    
}

export default blackjack;




