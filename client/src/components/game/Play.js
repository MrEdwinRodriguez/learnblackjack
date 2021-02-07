import React, {Fragment ,useEffect} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import blackjack  from '../../game/blackjack';

const Play = ({getCurrentProfile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    console.log(blackjack())
    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className='container'>
                        <div className='table'>
                            <h2 className='table-title'>BlackJack</h2>
                            <h5 className='table-pays'>Pays 2 to 3</h5>
                            <h5 className='table-dealer-stands'>Dealer Stand on 17</h5>
                            {/* <div className='hold-player-one'>
                                <div class='player-position-one'></div>
                            </div>
                            <div className='hold-player-two'>
                                <div class='player-position-two'></div>
                            </div> */}
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