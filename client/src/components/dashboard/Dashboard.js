import React, {Fragment ,useEffect} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({getCurrentProfile, auth, profile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className='container'>
                    <div className="signup-form">
                        <div>
                        <h2 className='text-primary-dashboard'>PLAY & LEARN</h2>
                            <div class="btn-group-vertical">
                                <Link to='play-black-jack' class="btn btn-primary">Play Black Jack</Link>
                                <Link to='learn-black-jack' class="btn btn-primary">Learn Black Jack</Link>
                                <Link to='rules' class="btn btn-primary">Rules</Link>
                                {/* <Link to='learn-to-play-black-jack-counting' class="btn btn-primary">Learn to</Link> */}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard)
