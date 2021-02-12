import React, {Fragment ,useEffect} from 'react'
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

    const gameObj = blackjack()
    gameObj.createDeck();
    gameObj.shuffle();
    gameObj.startblackjack(2);
    let dealerHandObj = gameObj.players.slice(-1)[0];
    // const playerHands = gameObj.players.map(player=> (
    let playerHands = null
    if (gameObj.players[0]) {
        console.log(gameObj.players[0])
        playerHands = gameObj.players[0].hand.map(card => {
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
    let dealerHand = dealerHandObj.hand.map(card => {
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

    const hitMe = (player = 0) => {
        gameObj.hit(player);
        const currentScore = gameObj.players[player];
        if (currentScore > 21 )
            gameObj.currentGameOutcome.push(this.loss);
        else if (currentScore == 21)
            gameObj.dealerPlay();
    };

    const stay = (player = 0) => {
        gameObj.dealerPlay();
        console.log(gameObj)
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
            gameObj.splitAce(player); 
            // gameObj.split(player)
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
                                    {playerHands ? playerHands : <li></li>}
                                </ul>
                            </div>
                        </div>
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