import React from 'react';
import {Link} from 'react-router-dom';

export const Landing = () => {
    return (
        <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Learn and Play Blackjack</h1>
            <p className="lead">
                Play Blackjack, learn to play Blackjack the right way, and learn to count.
            </p>
            <div className="buttons">
              <Link to="register" className="btn btn-primary">Sign Up</Link>
              <Link to="login" className="btn btn-light">Login</Link>
            </div>
          </div>
        </div>
      </section>
    )
}

export default Landing
