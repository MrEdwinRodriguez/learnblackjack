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
                                <button type="button" class="btn btn-primary">Play Black Jack</button>
                                <button type="button" class="btn btn-primary">Learn Black Jack</button>
                                <button type="button" class="btn btn-primary">Count Cards</button>
                                <button type="button" class="btn btn-primary">Learn to Count</button>
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
