import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Outcome = ({ outcomes }) => outcomes && outcomes !== null && outcomes.length > 0 && 

    outcomes.map(outcome => {
        return (
        <div key={outcome.id} className={`outcome outcome-${outcome.alertType}`}>
            {outcome.msg}
        </div>)
    })

Outcome.propTypes = {
    // outcomes: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    outcomes: state.outcomes
})

export default connect(mapStateToProps)(Outcome)