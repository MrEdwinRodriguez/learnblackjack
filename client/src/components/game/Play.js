import React, {Fragment ,useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { setAlert } from "../../actions/alert";
import { getCurrentProfile } from '../../actions/profile';
import blackjack  from '../../game/blackjack';
import { Double } from 'bson';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';

const Play = ({getCurrentProfile, setOutcome, setAlert, auth, profile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    const [formData, setFormData] = useState({
        money: profile ? profile.money : 1000,
        betAmount: 0,
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
        shuffleDeck: false,
        bidWarning: false,
    })
    let {money, hand, hands, dealer, gamePlayers, outcomes, disableDeal, disableHit, disableDouble, disableSplit, disableStay, showHitSplit, splitHandNumber, showDealerCards, betAmount, bidWarning, shuffleDeck } = formData;

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
        const reversedHands = hands.reverse();
        reversedHands.forEach(singleHand => {
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
        hands = reversedHands.reverse();
    }
    if (outcomes && outcomes.length > 0 && Array.isArray(outcomes)) {
        console.log('line 117', outcomes)
        outcomes.forEach(outcome => {
            if (outcome == 'Loss') {
                setAlert(outcome, 'danger', 1000);
            } else if (outcome == 'Win') {
                setAlert(outcome, 'success', 1000);
            } else {
                setAlert(outcome, 'white', 1000);
            }
                
        })
    }

    const setBet = e => setFormData({ ...formData, betAmount: e.target.value}); 
    const target = useRef(null);

    const deal = (players = 2) => {
        if (betAmount < 10) {
            setFormData({ ...formData, bidWarning: true})
            return false;
        }
        const evaluateInitialHand = gameObj.startblackjack(players);
        dealerHandObj = gameObj.players.slice(-1)[0];
        if (!evaluateInitialHand.hasBlackJack) {
            if (evaluateInitialHand.playerHasDoubles) {
                setFormData({ ...formData, hand: gameObj.players[0].hand, hands: [], dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, disableSplit: false, outcomes: [], showDealerCards: false, showHitSplit: false, showDealerCards: true, money: money - betAmount, bidWarning: false});
            } else {
                setFormData({ ...formData, hand: gameObj.players[0].hand, hands: [], dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, outcomes: [], showDealerCards: false, showHitSplit: false, showDealerCards: false, money: money - betAmount, bidWarning: false});
            }
        } else {
            let newTotal = money;
            if (gameObj.currentGameOutcome[0] == 'Push') newTotal = newTotal + betAmount;
            else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = newTotal + betAmount + (betAmount*1.5);
            else newTotal = newTotal - betAmount
            setFormData({ ...formData, hands: [], outcomes: gameObj.currentGameOutcome, showDealerCards: true, showHitSplit: false, money: newTotal, bidWarning: false })
        } 
    };

    const hitMe = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const currentOutcome = gameObj.hit(player);
        const currentScore = gameObj.getScore(player);
        console.log('line 159', currentScore, gameObj)
        if (currentScore > 21 ) {
            gameObj.currentGameOutcome.push(gameObj.loss);
            console.log('line 160', currentScore, gameObj)
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true});
        }
        else if (currentScore == 21) {
            gameObj.dealerPlay();
            let newTotal = money;
            if(gameObj.currentGameOutcome.length > 0) {
                if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(money) + parseInt(betAmount);
                else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(money) + parseInt(parseInt(betAmount)*2);
            }
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: false,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal});
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
        let newTotal = money;
        if(gameObj.currentGameOutcome.length > 0) {
            if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(newTotal) + parseInt(betAmount);
            else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(newTotal) + parseInt(parseInt(betAmount)*2);
        }
        setFormData({...formData, dealer: dealerHandObj.hand, outcomes: gameObj.currentGameOutcome,  disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal});
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
        let newTotal = money;
        if(gameObj.currentGameOutcome.length > 0) {
            if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(newTotal) + parseInt(betAmount);
            else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(newTotal) + parseInt(parseInt(betAmount)*3);
            else newTotal = parseInt(newTotal) - parseInt(betAmount);
        }
        setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: gameObj.players[0].hand, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal });
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
                        <div className='bet'>
                            <div className="btn btn-light" disabled>Available: {money}</div>setBet
                            <input className="form-control bet-input" type="number" id="betAmount" min="10" step="1" placeholder=" Min $10" value={betAmount} onChange={e => setBet(e)} />

                        </div>
                        <div className='blackjack-buttons'>
                            <div>
                                <button type="button" ref={target} className="btn btn-success" onClick={() => deal()} disabled={disableDeal} >Deal</button>
                                <Overlay target={target.current} show={bidWarning} placement="top">
                                    {(props) => (
                                    <Tooltip className="overlay-bid" {...props}>
                                        Minimum bet of $10
                                    </Tooltip>
                                    )}
                                </Overlay>
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
    auth: state.auth,
    profile: state.profile.profile
})

export default connect(mapStateToProps, {setAlert, getCurrentProfile})(Play)