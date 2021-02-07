const blackjack = () => {
    return {
            suite: ["Spades", "Hearts", "Diamonds", "Clubs"],
            values: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
            deck: [],
            players: [],
            createDeck: function () {
                let deck = [];
                for (let i = 0 ; i < this.values.length; i++) {
                    for(let x = 0; x < this.suits.length; x++) {
                        let weight = parseInt(this.values[i]);
                        if (this.values[i] == "J" || this.values[i] == "Q" || this.values[i] == "K")
                            weight = 10;
                        if (this.values[i] == "A")
                            weight = 11;
                        const card = { Value: this.values[i], Suit: this.suits[x], Weight: weight };
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
                    const player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
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
                        this.players[x].Hand.push(card);
                    }
                }
            },
            hit: function (player) {
                var card = this.deck.pop();
                this.players[player].Hand.push(card);
            }
}    
}

export default blackjack;




