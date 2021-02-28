import React, {Fragment ,useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { setAlert } from "../../actions/alert";
import { getCurrentProfile } from '../../actions/profile';
import blackjack  from '../../game/blackjack';
import { Double } from 'bson';

const Play = ({getCurrentProfile, setOutcome, setAlert}) => {
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
        showHitSplit: false,
        splitHandNumber: null,
        showDealerCards: false,
    })
    let {hand, hands, dealer, gamePlayers, outcomes, disableDeal, disableHit, disableDouble, disableSplit, disableStay, showHitSplit, splitHandNumber, showDealerCards } = formData;

    let dealerHandObj = null;
    let dealerHand = null;
    let playerHand = null;
    let playerHands = [];
    let displayOutcome = null;
    const gameObj = blackjack();
    gameObj.createDeck();
    gameObj.shuffle();
    if (dealer && dealer.length > 0) {
        if (!showDealerCards) {
            dealerHand = <li className="cardItem" weight={dealer[0].weight} key="1">
                    <div className='card red'>
                        <div className='card-topleft'>
                            <div className='card-corner-rank'>{dealer[0].value}</div>
                            <div className='card-corner-suit'>{dealer[0].suit}</div>
                        </div>
                        <div className='card-bottomright'>
                            <div className='card-corner-rank'>{dealer[0].value}</div>
                            <div className='card-corner-suit'>{dealer[0].suit}</div>
                        </div>
                    </div>
                </li>
        } else {
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
    }
    if (hand && hand.length > 0) {
        playerHand = hand.map(card => {
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
    if (hands && hands.length > 0) {
        hands.forEach(singleHand => {
            const individualHand = singleHand.hand.map(card => {
            return <li className="card_item_split" weight={card.weight} key="1">
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
            let unorderedList = <ul className='card_list_split'>{individualHand}</ul>
            playerHands.push(unorderedList);
        })
    }
    if (outcomes && outcomes.length > 0 && Array.isArray(outcomes)) {
        outcomes.forEach(outcome => {
            // setOutcome(outcome, 'danger', 1000);
            console.log('line 112', outcome)
            if (outcome == 'Loss')
                setAlert(outcome, 'danger', 1000);
            else if (outcome == 'Win')
                setAlert(outcome, 'success', 1000);
            else 
                setAlert(outcome, 'white', 1000);
        })
    }

    const deal = (players = 2) => {
        const evaluateInitialHand = gameObj.startblackjack(players);
        dealerHandObj = gameObj.players.slice(-1)[0];
        if (!evaluateInitialHand.hasBlackJack) {
            if (evaluateInitialHand.playerHasDoubles) {
                setFormData({ ...formData, hand: gameObj.players[0].hand, hands: [], dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, disableSplit: false, outcomes: [], showDealerCards: false, showHitSplit: false });
            } else {
                setFormData({ ...formData, hand: gameObj.players[0].hand, hands: [], dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, outcomes: [], showDealerCards: false, showHitSplit: false });
            }
        } else {
            setFormData({ ...formData, hands: [], outcomes: gameObj.currentGameOutcome, showDealerCards: true, showHitSplit: false})
        } 
    };

    const hitMe = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        console.log(gameObj)
        const currentOutcome = gameObj.hit(player);
        console.log(gameObj)
        const currentScore = gameObj.getScore(player);
        if (currentScore > 21 ) {
            gameObj.currentGameOutcome.push(gameObj.loss);
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true});
        }
        else if (currentScore == 21) {
            gameObj.dealerPlay();
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: false,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true});
        } else {
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDouble: true, disableSplit: true});
        }
    };

    const hitSplit = (player=0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const blackjackPlayer = gameObj.players[player];
        const totalHands = blackjackPlayer.hands.length;
        let handIndex = blackjackPlayer.hands.findIndex(singleHand => !singleHand.isDone);
        const currentHandOutcome = gameObj.hitSplitHand(player, handIndex);
        if (currentHandOutcome  > 21 ) {
            gameObj.currentGameOutcome.push(gameObj.loss);
            gameObj.players[player].hands[handIndex].isDone = true;
            if (totalHands-1 == handIndex ) {
                gameObj.dealerPlaySplit();
                setFormData({...formData, dealer: dealerHandObj.hand, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true}); 
            } else {
                setFormData({...formData, outcomes: currentHandOutcome});
            }
        } else if (currentHandOutcome  == 21) {
            gameObj.currentGameOutcome.push(gameObj.loss);
            gameObj.players[player].hands[handIndex].isDone = true;
            if (totalHands-1 == handIndex ) {
                gameObj.dealerPlaySplit();
                setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true}); 
            } else {
                setFormData({...formData, hands: gameObj.players[0].hands, outcomes: currentHandOutcome});
            }
        } else {
            setFormData({...formData, hands: gameObj.players[0].hands, outcomes: currentHandOutcome, disableDouble: true, disableSplit: true});
        }
    }

    const stay = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        gameObj.dealerPlay();
        dealerHandObj = gameObj.players.slice(-1)[0];
        setFormData({...formData, dealer: dealerHandObj.hand, outcomes: gameObj.currentGameOutcome,  disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true});
    };

    const staySplit = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const blackjackPlayer = gameObj.players[player];
        const totalHands = blackjackPlayer.hands.length;
        let handIndex = blackjackPlayer.hands.findIndex(singleHand => !singleHand.isDone);
        gameObj.players[player].hands[handIndex].isDone = true;
        if (totalHands-1 == handIndex ) {
            gameObj.dealerPlaySplit();
            const dealerHandObj = gameObj.players.slice(-1)[0];
            setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: gameObj.currentGameOutcome, disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true}); 
        } else {
            setFormData({...formData, hands: gameObj.players[player].hands});
        }
    }

    const double = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        gameObj.hit(player);
        gameObj.dealerPlay();
        setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: gameObj.players[0].hand, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true });
    }

    const split = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        var cardValue = gameObj.players[player].hand[0].value;
        if (cardValue == 'A') {
            gameObj.splitAce(player);
            setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: [],  hands: gameObj.players[player].hands, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true });
        } else {
            gameObj.split(player);
            setFormData({...formData, hand: [], hands: gameObj.players[player].hands, disableDeal: true, disableSplit: true,  showHitSplit: true, splitHandNumber: isNaN(splitHandNumber) ? 0 : splitHandNumber++})
        }
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
                        <div className='game_outcome'> {displayOutcome ? displayOutcome : ""}</div>
                            <h2 className='table-title'>BlackJack</h2>
                            <h5 className='table-pays'>Pays 2 to 3</h5>
                            <h5 className='table-dealer-stands'>Dealer Stand on 17</h5>
                             <div className='hold-player-one'>
                                <div class='player-position-one'>
                                    <ul className='cardList'>
                                        {playerHand ? playerHand : <li></li>}
                                    </ul>
                                    <div className='hold_split'>
                                        {playerHands ? playerHands : <li></li>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='blackjack-buttons'>
                            <div>
                                <button type="button" className="btn btn-success" onClick={() => deal()} disabled={disableDeal} >Deal</button>
                                <button type="button" className="btn btn-success" onClick={() => {!showHitSplit ? hitMe() : hitSplit()}} disabled={disableHit} >Hit</button>
                                <button type="button" className="btn btn-success" onClick={() => double()} disabled={disableDouble}>Double</button>
                                <button type="button" className="btn btn-success" onClick={() => split()} disabled={disableSplit}>Split</button>
                                <button type="button" className="btn btn-danger" onClick={() => {!showHitSplit ? stay() : staySplit()}} disabled={disableStay}>Stay</button>
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
    setAlert: PropTypes.func.isRequired,
    // blackjack: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    // auth: state.auth,
    // profile: state.profile
})

export default connect(mapStateToProps, {setAlert, getCurrentProfile})(Play)