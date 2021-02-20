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
        disableDeal: false,
        disableHit: true,
        disableDouble: true,
        disableSplit: true,
        disableStay: true,
    })
    let {hand, hands, dealer, gamePlayers, outcomes, disableDeal, disableHit, disableDouble, disableSplit, disableStay } = formData;

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
            return <li key={key}><h1>{outcome}</h1></li>
        })
    }

    const deal = (players = 2) => {
        if (outcomes.length > 0 ) { 
            setFormData({ ...formData, outcomes: []})
            displayOutcome = null;
        }
        const evaluateInitialHand = gameObj.startblackjack(players);
        dealerHandObj = gameObj.players.slice(-1)[0];
        if (!evaluateInitialHand.hasBlackJack) {
            if (evaluateInitialHand.playerHasDoubles) {
                setFormData({ ...formData, hand: gameObj.players[0].hand, dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, disableSplit: false });
            } else {
                setFormData({ ...formData, hand: gameObj.players[0].hand, dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false });
            }
        } else {
            setFormData({ ...formData, outcomes: gameObj.currentGameOutcome})
        } 
    };

    const hitMe = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const currentOutcome = gameObj.hit(player);
        const currentScore = gameObj.players[player];
        if (currentScore > 21 ) {
            gameObj.currentGameOutcome.push(this.loss);
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true});
        }
        else if (currentScore == 21) {
            gameObj.dealerPlay();
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: false,  disableDouble: true, disableSplit: true, disableStay: true});
        } else {
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDouble: true, disableSplit: true});
        }
    };

    const stay = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        gameObj.dealerPlay();
        dealerHandObj = gameObj.players.slice(-1)[0];
        setFormData({...formData, dealer: dealerHandObj.hand, outcomes: gameObj.currentGameOutcome,  disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true});
    };

    const double = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        gameObj.hit(player);
        gameObj.dealerPlay();
        setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: gameObj.players[0].hand, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true });
    }

    const split = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        var cardValue = gameObj.players[player].hand[0].value;
        if (cardValue == 'A') {
            gameObj.splitAce(player);
            setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hands: gameObj.players[0].hands, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true });
        } else {
            gameObj.split(player); 
            // TO DO : setFormData after split non ace hands
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
                                <button type="button" className="btn btn-success" onClick={() => deal()} disabled={disableDeal} >Deal</button>
                                <button type="button" className="btn btn-success" onClick={() => hitMe()} disabled={disableHit}>Hit</button>
                                <button type="button" className="btn btn-success" onClick={() => double()} disabled={disableDouble}>Double</button>
                                <button type="button" className="btn btn-success" onClick={() => split()} disabled={disableSplit}>Split</button>
                                <button type="button" className="btn btn-danger" onClick={() => stay()} disabled={disableStay}>Stay</button>
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