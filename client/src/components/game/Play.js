import React, {Fragment ,useEffect} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

const Play = ({getCurrentProfile, auth, profile}) => {
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
                        <h2 className='text-primary-dashboard'>Play Black Jack</h2>

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
    // auth: PropTypes.object.isRequired,
    // profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    // auth: state.auth,
    // profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Play)