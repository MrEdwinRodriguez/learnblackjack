import React, {Fragment ,useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { setAlert } from "../../actions/alert";
import { getCurrentProfile, updateMoney } from '../../actions/profile';
import blackjack  from '../../game/blackjack';
import basicStrategy  from '../../game/basicStratagy';
import { Double } from 'bson';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import PlayerCards from './display/PlayerCards';
import DealerCards from './display/DealerCards';
import PlayerSplitCards from './display/PlayerSplitCards';

const Learn = ({getCurrentProfile, updateMoney, setOutcome, setAlert, auth, profile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    const [formData, setFormData] = useState({
        money: 1000,
        profileMoney: 0,
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
        showRecommendation: false,
        recommendationState: null,
        shuffleDeck: false,
        bidWarning: null,
        profileLoaded: false,
        strategy: null,
        showRestart: false
    })
    let {money, hand, hands, dealer, gamePlayers, outcomes, disableDeal, disableHit, disableDouble, disableSplit, disableStay, showHitSplit, splitHandNumber, showDealerCards, showRecommendation, recommendationState, betAmount, bidWarning, shuffleDeck, profileLoaded, strategy, profileMoney, showRestart } = formData;


    if (profile && !profileLoaded) {
        setFormData({...formData, profileMoney: profile.money, profileLoaded: true});
    }
    let dealerHandObj = null;
    let dealerHand = null;
    let playerHand = null;
    let playerHands = [];
    let displayOutcome = null;
    const gameObj = blackjack();
    // const stratagy = basicStratagy();
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

    const bookSays = (isOriginalHand = false, isPair = false, handIndex = null) => {
        const recommendation = basicStrategy(gameObj.getDealerFirstCard(),gameObj.getScore(0, handIndex != null && handIndex >= 0 ? handIndex : null), isOriginalHand, gameObj.playerHasAce(hands.length > 0 ? true :false), isPair );
        console.log(recommendation)
        return recommendation;
    }

    const deal = (players = 2) => {
        if (betAmount < 10) {
            setFormData({ ...formData, bidWarning: "Minimum Bet is $10"})
            return false;
        } else if (betAmount > 100) {
            setFormData({ ...formData, bidWarning: "Maximum Bet is $100"})
            return false;
        } else if (betAmount > money) {
            setFormData({ ...formData, bidWarning: 'You Do Not Enough Money for this bet'})
            return false;
        } else if (money < 10 ) {
            setFormData({ ...formData, showRestart: true, bidWarning: 'You ran out of Learn credits. Hit Restart to begin new learning session '})
            return false
        }
        const evaluateInitialHand = gameObj.startblackjack(players);
        dealerHandObj = gameObj.players.slice(-1)[0];
        if (!evaluateInitialHand.hasBlackJack) {
            if (evaluateInitialHand.playerHasDoubles) {
                const recommend = bookSays(true, true);
                setFormData({ ...formData, hand: gameObj.players[0].hand, hands: [], dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, disableSplit: false, outcomes: [], showDealerCards: false, showHitSplit: false, showRecommendation: true, recommendationState: recommend, money: money - betAmount, bidWarning: null});
            } else {
                const recommend = bookSays(true, false);
                setFormData({ ...formData, hand: gameObj.players[0].hand, hands: [], dealer: dealerHandObj.hand, gamePlayers: gameObj.players, disableDeal: true, disableHit: false, disableDouble: false, disableStay: false, outcomes: [], showDealerCards: false, showHitSplit: false, showDealerCards: false, showRecommendation: true, recommendationState: recommend, money: money - betAmount, bidWarning: null});
            }
        } else {
            let newTotal = money;
            if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(newTotal) + parseInt(betAmount);
            else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(newTotal) + parseInt(betAmount) + (parseInt(betAmount)*1.5);
            else newTotal = parseInt(newTotal) - parseInt(betAmount);
            setFormData({ ...formData, hands: [], dealer: dealerHandObj.hand, hand: gameObj.players[0].hand,  outcomes: gameObj.currentGameOutcome, showHitSplit: false, money: newTotal, bidWarning: null, showDealerCards: true })
        } 
    };

    const hitMe = (player = 0) => {
        if (gameObj.players.length == 0) gameObj.players = gamePlayers;
        const currentOutcome = gameObj.hit(player);
        const currentScore = gameObj.getScore(player);
        if (currentScore > 21 ) { 
            updateMoney({money: parseInt(profileMoney) + 10});
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, profileMoney: (parseInt(profileMoney) + 10)});
        }
        else if (currentScore == 21) {
            gameObj.dealerPlay();
            let newTotal = money;
            if(gameObj.currentGameOutcome.length > 0) {
                if (gameObj.currentGameOutcome[0] == 'Push') newTotal = parseInt(money) + parseInt(betAmount);
                else if (gameObj.currentGameOutcome[0] == 'Win') newTotal = parseInt(money) + parseInt(parseInt(betAmount)*2);
            }
            updateMoney({money: parseInt(profileMoney) + 10});
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDeal: false, disableHit: false,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal, profileMoney: (parseInt(profileMoney) + 10)});
        } else {
            const recommend = bookSays();
            setFormData({...formData, hand: gameObj.players[0].hand, outcomes: currentOutcome.length > 0 ? currentOutcome : [], disableDouble: true, disableSplit: true, recommendationState: recommend});
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
                setFormData({...formData, dealer: dealerHandObj.hand, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, profileMoney: (parseInt(profileMoney) + 10)}); 
                updateMoney({money: parseInt(profileMoney) + 10});
            } else {
                const recommend = bookSays(true, gameObj.playerHasDoubles(player, handIndex), handIndex);
                setFormData({...formData, outcomes: currentHandOutcome, recommendationState: recommend});
            }
        } else if (currentHandOutcome  == 21) {
            gameObj.currentGameOutcome.push(gameObj.loss);
            gameObj.players[player].hands[handIndex].isDone = true;
            if (totalHands-1 == handIndex ) {
                gameObj.dealerPlaySplit();
                setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, profileMoney: (parseInt(profileMoney) + 10)}); 
                updateMoney({money: parseInt(profileMoney) + 10});
            } else {
                const recommend = bookSays(true, gameObj.playerHasDoubles(player, handIndex), handIndex);
                setFormData({...formData, hands: gameObj.players[0].hands, outcomes: currentHandOutcome, recommendationState: recommend});
            }
        } else {
            const recommend = bookSays(true, gameObj.playerHasDoubles(player, handIndex), handIndex);
            setFormData({...formData, hands: gameObj.players[0].hands, outcomes: currentHandOutcome, disableDouble: true, disableSplit: true, recommendationState: recommend});
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
        updateMoney({money: parseInt(profileMoney) + 10});
        setFormData({...formData, dealer: dealerHandObj.hand, outcomes: gameObj.currentGameOutcome,  disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal, profileMoney: (parseInt(profileMoney) + 10)});
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
            updateMoney({money: parseInt(profileMoney) + 10});
            setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: gameObj.currentGameOutcome, disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, profileMoney: (parseInt(profileMoney) + 10)}); 
        } else {
            gameObj.hitSplitHand(player, handIndex+1);
            const handHasDouble = gameObj.playerHasDoubles(player, handIndex >= 0 ? handIndex : null)
            const recommend = bookSays(true, handHasDouble, handIndex);
            setFormData({...formData, hands: gameObj.players[player].hands, showHitSplit: handHasDouble, recommendationState: recommend});
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
        updateMoney({money: parseInt(profileMoney) + 10});
        const recommend = bookSays();
        setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: gameObj.players[0].hand, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, money: newTotal, recommendationState: recommend, profileMoney: (parseInt(profileMoney) + 10) });
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
            updateMoney({money: parseInt(profileMoney) + 10});
            setFormData({...formData, dealer: dealerHandObj.hand, hands: gameObj.players[player].hands, outcomes: currentHandOutcome.length > 0 ?  currentHandOutcome : [], disableDeal: false, disableHit: true,  disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, profileMoney: (parseInt(profileMoney) + 10)}); 
        } else {
            gameObj.hitSplitHand(player, handIndex+1);
            const recommend = bookSays(true, gameObj.playerHasDoubles(player, handIndex));
            setFormData({...formData, hands: gameObj.players[0].hands, outcomes: currentHandOutcome, recommendationState: recommend});
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
            updateMoney({money: parseInt(profileMoney) + 10});
            setFormData({...formData,  outcomes: gameObj.currentGameOutcome, hand: [],  hands: gameObj.players[player].hands, dealer: gameObj.players[gameObj.players.length -1].hand, disableDeal: false, disableHit: true, disableDouble: true, disableSplit: true, disableStay: true, showDealerCards: true, profileMoney: (parseInt(profileMoney) + 10) });
        } else {
            dealerHandObj = gameObj.players.slice(-1)[0];
            let handIndex = gameObj.players[player].hands.findIndex(singleHand => !singleHand.isDone);
            let handHasDouble = false;
            if (gameObj.players[player].hands.length > 0) {
                handHasDouble = gameObj.playerHasDoubles(player, handIndex >= 0 ? handIndex : 0)
            }
            if (blackjackPlayer.hands && blackjackPlayer.hands.length > 0) {
                gameObj.splitSplit(player, handIndex)  
            } else {
                gameObj.split(player)
            };
            let recommend = null;
            if (gameObj.players[player].hands.length > 0) {
                if (handIndex < 0) {
                    handIndex = gameObj.players[player].hands.findIndex(singleHand => !singleHand.isDone);
                }
                console.log('line 275', handIndex)
                recommend = bookSays(true, gameObj.playerHasDoubles(player, handIndex >= 0 ? handIndex : 0), handIndex);
            }
            setFormData({...formData, hand: [], hands: gameObj.players[player].hands, disableDeal: true, disableSplit: handHasDouble ? false : true,  showHitSplit: true, recommendationState: recommend, splitHandNumber: isNaN(splitHandNumber) ? 0 : splitHandNumber++})
        }
    }

    const restartLearn = () =>{
        window.location.reload();
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
                            {showRecommendation ? <div class='recommendation'>The book says you should: <span className='recommend-text'><strong>{recommendationState}</strong></span></div> : <div></div>}
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
                            <input className="form-control bet-input" type="number" id="betAmount" min="10" max="100" step="1" placeholder=" Min $10" value={betAmount} onChange={e => setBet(e)} />
                        </div>
                        <div class="row justify-content-md-center blackjack-buttons">
                            <div class="col col-xs-12">
                                <button type="button" ref={target} className="btn btn-success" onClick={() => deal()} disabled={disableDeal} >Deal</button>
                                <Overlay target={target.current} show={bidWarning ? true : false} placement="top">
                                    {(props) => (
                                    <Tooltip className="overlay-bid" {...props}>
                                        {bidWarning}
                                    </Tooltip>
                                    )}
                                </Overlay>
                            </div>
                            <div class="col-xs-12">
                                <button type="button" className="btn btn-success" onClick={() => {!showHitSplit ? hitMe() : hitSplit()}} disabled={disableHit} >Hit</button>
                            </div>
                            <div class="col-xs-12">
                                <button type="button" className="btn btn-success" onClick={() => {!showHitSplit ? double() : doubleSplit()}} disabled={disableDouble}>Double</button>
                            </div>
                            <div class="col-xs-12">
                                <button type="button" className="btn btn-success" onClick={() => split()} disabled={disableSplit}>Split</button>
                            </div>
                            <div class="col-xs-12">
                                <button type="button" className="btn btn-danger" onClick={() => {!showHitSplit ? stay() : staySplit()}} disabled={disableStay}>Stay</button>
                            </div>
                            <div class="col col-xs-12">
                                {showRestart ? <button type="button" className="btn btn-danger" onClick={() => restartLearn()} >Restart</button>: <div></div> }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

Learn.propTypes = {
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

export default connect(mapStateToProps, {setAlert, getCurrentProfile, updateMoney})(Learn)