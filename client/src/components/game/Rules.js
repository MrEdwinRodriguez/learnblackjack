
import React, {Fragment ,useEffect} from 'react'
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import  { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import rules  from '../../game/rules';
import ListGroup from 'react-bootstrap/ListGroup';

const Counting = ({getCurrentProfile, auth, profile}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);

    const blackjackRules = rules();
    console.log(blackjackRules)

    const listRules = blackjackRules.map((blackjackRule, index) => {
        return <ListGroup.Item>{index+1}. {blackjackRule}</ListGroup.Item>
    })

    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className='container'>
                    <div className="signup-form">
                        
                        <h2 className='text-primary-dashboard'>Rules</h2>
                        <ListGroup className='rules'>
                            {listRules}
                        </ListGroup>

                    </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

Counting.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    // auth: PropTypes.object.isRequired,
    // profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    // auth: state.auth,
    // profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Counting)