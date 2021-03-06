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
            startblackjack: function (players = 2) {
                // this.createDeck();
                // this.shuffle();
                this.createPlayers(players);
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
            hitSplitHand: function (player, handIndex) {
                var card = this.deck.pop();
                this.players[player].hands[handIndex].hand.push(card);
                var score = this.getScore(player, handIndex);
                if (score > 21 && this.currentGameOutcome.length == 0) {
                    this.currentGameOutcome = [this.loss];
                } else if (score > 21) {
                    this.currentGameOutcome.push(this.loss)
                }
                return this.currentGameOutcome;
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
            playerHasDoubles: function (player=0, index=null) {
                if (!index && index != 0) { //initial hand
                    if (this.players[player].hand[0].weight == this.players[player].hand[1].weight) return true;
                    else return false
                } else { //split hand
                    console.log('line 132', player, index)
                    if (this.players[player].hands[index].hand[0].weight == this.players[player].hands[index].hand[1].weight) return true;
                    else return false
                }
            },
            dealerPlay: function () {
                let that = this;
                let dealer = this.players.slice(-1)[0];
                let aces = 0;
                console.log(this)
                var dealerHandValue = dealer.hand.reduce(function(total, currentValue) { 
                    if (currentValue.weight == 11) aces++;
                    let actualTotal = total && total.weight ? total.weight : total;
                    let weight = currentValue && currentValue.weight ? currentValue.weight : currentValue;
                    return actualTotal + weight;  
                })
                if (dealerHandValue > 21 && aces > 0) {
                    while (dealerHandValue > 21 && aces > 0) {
                        aces --;
                        dealerHandValue = dealerHandValue - 10;
                    }
                }
                if (dealerHandValue == 21 && dealer.hand.length == 2) {
                    const player = this.players[0];
                    let playerHandValue = this.getScore(0, null);
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
                    if (card.weight = 11 && dealerHandValue > 21) {
                        while (dealerHandValue > 21 && aces > 0) {
                            aces --;
                            dealerHandValue = dealerHandValue - 10;
                        }
                    }
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
                let aces = 0;
                var dealerHandValue =dealer.hand.reduce(function(total, currentValue) { 
                    if (currentValue.weight == 11) aces++;
                    let actualTotal = total && total.weight ? total.weight : total;
                    let weight = currentValue && currentValue.weight ? currentValue.weight : currentValue;
                    return actualTotal + weight;  
                })
                if (dealerHandValue > 21 && aces > 0) {
                    while (dealerHandValue > 21 && aces > 0) {
                        aces --;
                        dealerHandValue = dealerHandValue - 10;
                    }
                }
                while (dealerHandValue < 17) {
                    var card = this.deck.pop();
                    dealerHandValue = dealerHandValue + card.weight;
                    if (card.weight = 11 && dealerHandValue > 21) {
                        while (dealerHandValue > 21 && aces > 0) {
                            aces --;
                            dealerHandValue = dealerHandValue - 10;
                        }
                    }
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
            getScore: function (playerIndex=0, handIndex=null) {
                const player = this.players[playerIndex];
                let playerHandValue = null;
                if (handIndex !== null) {
                    let aces = 0;
                    playerHandValue = player.hands[handIndex].hand.reduce(function(total, currentValue){ 
                        if (currentValue.weight == 11) aces++;
                        let actualTotal = total && total.weight ? total.weight : total;
                        let weight = currentValue && currentValue.weight ? currentValue.weight : currentValue;
                        return actualTotal + weight;  
                    })
                    if (playerHandValue > 21 && aces > 0) {
                        while (playerHandValue > 21 && aces > 0) {
                            aces --;
                            playerHandValue = playerHandValue - 10;
                        }
                    }
                } else {
                    let aces = 0;
                    playerHandValue = player.hand.reduce(function(total, currentValue){
                        if (currentValue.weight  == 11) aces++;
                        let actualTotal = total && total.weight ? total.weight : total;
                        let weight = currentValue && currentValue.weight ? currentValue.weight : currentValue;
                        return actualTotal + weight;  
                    })
                    if (playerHandValue > 21 && aces > 0) {
                        while (playerHandValue > 21 && aces > 0) {
                            aces --;
                            playerHandValue = playerHandValue - 10;
                        }
                    }
                }
                return playerHandValue;
            },
            getScoreWithSplit: function (aHands) {
                const hands = aHands;
                let resultsArray = []
                for (let index=0; index<hands.length ; index++) {
                    resultsArray.push(this.getScore(0, index))
                }
                return resultsArray;
            },
            splitAce: function (playerIndex) {
                let player = this.players[playerIndex];
                let currentHand = player.hand; //array of cards
                player.hands = [
                    {
                        isDone: false,
                        hand: [currentHand[0]]
                    },
                    {
                        isDone: false,
                        hand: [currentHand[1]]
                    }
                ]
                const firstCard = this.deck.pop();
                this.players[playerIndex].hands[0].hand.push(firstCard);                 
                const secondCard = this.deck.pop();
                this.players[playerIndex].hands[1].hand.push(secondCard);
                this.players[playerIndex].hand = [];
                this.dealerPlaySplit();
            },
            split: function (playerIndex) {
                let player = this.players[playerIndex];
                let currentHand = player.hand; //array of cards
                player.hands = [
                    {
                        isDone: false,
                        hand: [currentHand[0]]
                    },
                    {
                        isDone: false,
                        hand: [currentHand[1]]
                    }
                ]
                const firstCard = this.deck.pop();
                this.players[playerIndex].hand = [];
                this.players[playerIndex].hands[0].hand.push(firstCard); 
            },
            splitSplit: function (playerIndex=0, handIndex) {
                let player = this.players[playerIndex];
                let currentHand = player.hands[handIndex];
                player.hands.push({
                    isDone: false,
                    hand: [currentHand.hand[1]]
                });
                this.players[playerIndex].hands[handIndex].hand.pop();
                const newCard = this.deck.pop();
                this.players[playerIndex].hands[handIndex].hand.push(newCard);
            },
            getDealerFirstCard: function () {
                return this.players[this.players.length -1].hand[0].weight;
            },
            playerHasAce: function (player = 0, isSplit = false) {
                if (isSplit) {
                    let handIndex = this.players[player].hands.findIndex(singleHand => !singleHand.isDone);
                    return this.players[player].hands[handIndex].some(card => {
                        return card.value == "A";
                    })
                } else {
                    return this.players[0].hand.some(card => {
                        return card.value == "A";
                    })
                };
            }
}    
}

export default blackjack;




