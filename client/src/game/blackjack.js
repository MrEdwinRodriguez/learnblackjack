export const blackjack = {
    suite: ["Spades", "Hearts", "Diamonds", "Clubs"],
    values: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
    deck: [],
    players: [],
    createDeck: () => {
        deck = [];
        for (let i = 0 ; i < this.values.length; i++) {
            for(let x = 0; x < this.suits.length; x++) {
                const weight = parseInt(values[i]);
                if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                    weight = 10;
                if (values[i] == "A")
                    weight = 11;
                const card = { Value: values[i], Suit: suits[x], Weight: weight };
                deck.push(card);
            }
        }
        this.deck = deck;
    },
    shuffle: () => {
        for (let i = 0; i < 1000; i++) {
            const location1 = Math.floor((Math.random() * this.deck.length));
            const location2 = Math.floor((Math.random() * this.deck.length));
            const tmp = this.deck[location1];
            deck[location1] = this.deck[location2];
            deck[location2] = tmp;
        }
        this.deck = deck;
    },
    createPlayers: (num) => {
        players = [];
        for (let i = 1; i <= num; i++) {
            const hand = new Array();
            const player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
            players.push(player);
        }
    },
    startblackjack: (players = 2) => {
        // deal 2 cards to every player object
        currentPlayer = 0;
        this.createDeck();
        this.shuffle();
        this.createPlayers(players);
        this.dealHands();
    },
    dealHands: () => {
        for(let  i = 0; i < 2; i++) {
            for (let x = 0; x < players.length; x++) {
                //card will have the card selected, pop will update the deck
                var card = deck.pop();
                players[x].Hand.push(card);
            }
        }
    },
    hit: (player) => {
        var card = deck.pop();
        this.players[player].Hand.push(card);
    }

}






