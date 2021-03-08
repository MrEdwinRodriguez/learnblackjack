import React, {Fragment ,useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { setAlert } from "../../actions/alert";
import { getCurrentProfile, updateMoney } from '../../actions/profile';
import blackjack  from '../../game/blackjack';
import { Double } from 'bson';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import PlayerCards from './display/PlayerCards';
import DealerCards from './display/DealerCards';
import PlayerSplitCards from './display/PlayerSplitCards';

const Play = ({getCurrentProfile, updateMoney, setOutcome, setAlert, auth, profile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    const [formData, setFormData] = useState({
        money: profile ? profile.money : 0,
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
        profileLoaded: false,
    })
    let {money, hand, hands, dealer, gamePlayers, outcomes, disableDeal, disableHit, disableDouble, disableSplit, disableStay, showHitSplit, splitHandNumber, showDealerCards, betAmount, bidWarning, shuffleDeck, profileLoaded } = formData;


    if (profile && !profileLoaded) {
        setFormData({...formData, money: profile.money, profileLoaded: true});
    }
    let dealerHandObj = null;
    let dealerHand = null;
    let playerHand = null;
    let playerHands = [];
    let displayOutcome = null;
    const gameObj = blackjack();
    gameObj.createDeck();
    gameObj.shuffle();
    if (dealer && dealer.length > 0) {
        dealerHand = <DealerCards dealer={dealer} showDealerCards={showDealerCards}/>
    }
    if (hand && hand.length > 0) {
        playerHand = <PlayerCards hand={hand}/>
    }
    if (hands && hands.length > 0) {
        const reversedHands = hands.reverse();
        reversedHands.forEach(singleHand => {
            const individualHand = singleHand.hand.map(card => {
                return <PlayerSplitCards card={card} />
            })
            let unorderedList = <ul className='card_list_split'>{individualHand}</ul>
            playerHands.push(unorderedList);
        })
        hands = reversedHands.reverse();
    }
    if (outcomes && outcomes.length > 0 && Array.isArray(outcomes)) {
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
            if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(newTotal) + parseInt(betAmount);
            else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(newTotal) + parseInt(betAmount) + (parseInt(betAmount)*1.5);
            else newTotal = parseInt(newTotal) - parseInt(betAmount);
            setFormData({ ...formData, hands: [], dealer: dealerHandObj.hand, hand: gameObj.players[0].hand,  outcomes: gameObj.currentGameOutcome, showHitSplit: false, money: newTotal, bidWarning: false, showDealerCards: true })
        } 
    };

    const hitMe = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const currentOutcome = gameObj.hit(player);
        const currentScore = gameObj.getScore(player);
        if (currentScore > 21 ) {
            updateMoney({money: money});
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true});
        }
        else if (currentScore == 21) {
            gameObj.dealerPlay();
            let newTotal = money;
            if(gameObj.currentGameOutcome.length > 0) {
                if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(money) + parseInt(betAmount);
                else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(money) + parseInt(parseInt(betAmount)*2);
            }
            updateMoney({money: newTotal});
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
                updateMoney({money: money});
            } else {
                setFormData({...formData, outcomes: currentHandOutcome});
            }
        } else if (currentHandOutcome  == 21) {
            gameObj.currentGameOutcome.push(gameObj.loss);
            gameObj.players[player].hands[handIndex].isDone = true;
            if (totalHands-1 == handIndex ) {
                gameObj.dealerPlaySplit();
                setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true}); 
                updateMoney({money: money});
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
        updateMoney({money: newTotal});
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
            updateMoney({money: money});
            setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: gameObj.currentGameOutcome, disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true}); 
        } else {
            gameObj.hitSplitHand(player, handIndex+1);
            const handHasDouble = gameObj.playerHasDoubles(player, handIndex >= 0 ? handIndex : null)
            setFormData({...formData, hands: gameObj.players[player].hands, showHitSplit: handHasDouble});
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
        updateMoney({money: newTotal});
        setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: gameObj.players[0].hand, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal });
    }

    const doubleSplit = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const blackjackPlayer = gameObj.players[player];
        const totalHands = blackjackPlayer.hands.length;
        const handIndex = blackjackPlayer.hands.findIndex(singleHand => !singleHand.isDone);
        const currentHandOutcome = gameObj.hitSplitHand(player, handIndex);
        gameObj.players[player].hands[handIndex].isDone = true;
        if (totalHands-1 == handIndex ) {
            gameObj.dealerPlaySplit();
            dealerHandObj = gameObj.players.slice(-1)[0];
            updateMoney({money: money});
            setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true}); 
        } else {
            gameObj.hitSplitHand(player, handIndex+1);
            setFormData({...formData, hands: gameObj.players[0].hands, outcomes: currentHandOutcome});
        }
    }

    const split = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        var cardValue;
        const blackjackPlayer = gameObj.players[player];
        if (gameObj.players[player].hand.length > 0) {
            cardValue = gameObj.players[player].hand[0].value;
        } else {
            const handIndexCheck = blackjackPlayer.hands.findIndex(singleHand => !singleHand.isDone);
            cardValue = gameObj.players[player].hands[handIndexCheck].hand.value;
        }
        if (cardValue == 'A') {
            gameObj.splitAce(player);
            updateMoney({money: money});
            setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: [],  hands: gameObj.players[player].hands, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true });
        } else {
            dealerHandObj = gameObj.players.slice(-1)[0];
            const handIndex = blackjackPlayer.hands.findIndex(singleHand => !singleHand.isDone);
            const handHasDouble = gameObj.playerHasDoubles(player, handIndex >= 0 ? handIndex : null)
            if (blackjackPlayer.hands && blackjackPlayer.hands.length > 0) {
                gameObj.splitSplit(player, handIndex)  
            } else {
                gameObj.split(player)
            }
           ;
            setFormData({...formData, hand: [], hands: gameObj.players[player].hands, disableDeal: true, disableSplit: handHasDouble ? false : true,  showHitSplit: true, splitHandNumber: isNaN(splitHandNumber) ? 0 : splitHandNumber++})
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
                                <button type="button" className="btn btn-success" onClick={() => {!showHitSplit ? double() : doubleSplit()}} disabled={disableDouble}>Double</button>
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
    updateMoney: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    // blackjack: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile.profile
})

export default connect(mapStateToProps, {setAlert, getCurrentProfile, updateMoney})(Play)