import React, {Fragment ,useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import blackjack  from '../../game/blackjack';
import { Double } from 'bson';

const Play = ({getCurrentProfile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    const [formData, setFormData] = useState({
        hand: [],
        hands: [],
        dealer: [],
        gamePlayers: [],
        outcomes: [],
    })
    let {hand, hands, dealer, gamePlayers, outcomes } = formData;

    let dealerHandObj = null;
    let dealerHand = null;
    let playerHands = null;
    let displayOutcome = null;
    const gameObj = blackjack();
    gameObj.createDeck();
    gameObj.shuffle();
    if (dealer && dealer.length > 0) {
        dealerHand = dealer.map(card => {
            return <li className="cardItem" weight={card.weight} key="1">
                <div className='card red'>
                    <div className='card-topleft'>
                        <div className='card-corner-rank'>{card.value}</div>
                        <div className='card-corner-suit'>{card.suit}</div>
                    </div>
                    <div className='card-bottomright'>
                        <div className='card-corner-rank'>{card.value}</div>
                        <div className='card-corner-suit'>{card.suit}</div>
                    </div>
                </div>
            </li>
        })
    }
    if (hand && hand.length > 0) {
        playerHands = hand.map(card => {
                return <li className="cardItem" weight={card.weight} key="1">
                <div className='card red'>
                    <div className='card-topleft'>
                        <div className='card-corner-rank'>{card.value}</div>
                        <div className='card-corner-suit'>{card.suit}</div>
                    </div>
                    <div className='card-bottomright'>
                        <div className='card-corner-rank'>{card.value}</div>
                        <div className='card-corner-suit'>{card.suit}</div>
                    </div>
                </div>
            </li>
        })
    }
    if (outcomes && outcomes.length > 0 && Array.isArray(outcomes)) {
        let key = 0; 
        displayOutcome = outcomes.map(outcome => {
            key++;
            return <li key={key}>{outcome}</li>
        })
    }

    const deal = (players = 2) => {
        if (outcomes.length > 0 ) {
            setFormData({ ...formData, currentGameOutcome: []});
            displayOutcome = null;
        }
        gameObj.startblackjack(players);
        dealerHandObj = gameObj.players.slice(-1)[0];
        setFormData({ ...formData, hand: gameObj.players[0].hand, dealer: dealerHandObj.hand, gamePlayers: gameObj.players });
    };

    const hitMe = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        gameObj.hit(player);
        const currentScore = gameObj.players[player];
        if (currentScore > 21 )
            gameObj.currentGameOutcome.push(this.loss);
        else if (currentScore == 21)
            gameObj.dealerPlay();
        setFormData({...formData, hand: gameObj.players[0].hand});
    };

    const stay = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        gameObj.dealerPlay();
        dealerHandObj = gameObj.players.slice(-1)[0];
        setFormData({...formData, dealer: dealerHandObj.hand, outcomes: gameObj.currentGameOutcome});
    };

    const double = (player = 0) => {
        gameObj.hit(player);
        gameObj.dealerPlay();
    }

    const split = (player = 0) => {
        var cardValue = gameObj.players[player].hand[0].value;
        if (cardValue == 'A') {
            gameObj.splitAce(player); 
        } else {
            gameObj.split(player); 
        }
        setFormData({...formData, hand: [], hands: gameObj.hands})
    }
    // ));
    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className='container'>
                        <div className='table'>
                        <div className='hold-dealer'>
                            <div class='dealer'>
                                <ul className='cardList'>
                                    {dealerHand ? dealerHand : <li></li>}
                                </ul>
                            </div>
                        </div>
                        <div> 
                            {displayOutcome ? displayOutcome : ""}
                        </div>
                        <div className='game_outcome'></div>
                            <h2 className='table-title'>BlackJack</h2>
                            <h5 className='table-pays'>Pays 2 to 3</h5>
                            <h5 className='table-dealer-stands'>Dealer Stand on 17</h5>
                             <div className='hold-player-one'>
                                <div class='player-position-one'>
                                    <ul className='cardList'>
                                        {playerHands ? playerHands : <li></li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='blackjack-buttons'>
                            <div>
                                <button type="button" className="btn btn-success" onClick={() => deal()} >Deal</button>
                                <button type="button" className="btn btn-success" onClick={() => hitMe()} >Hit</button>
                                <button type="button" className="btn btn-warning" onClick={() => double()}>Double</button>
                                <button type="button" className="btn btn-primary" onClick={() => split()}>Split</button>
                                <button type="button" className="btn btn-danger" onClick={() => stay()}>Stay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

Play.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    // blackjack: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    // auth: state.auth,
    // profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Play)