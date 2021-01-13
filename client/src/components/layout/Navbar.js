import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className="navbar bg-dark">
        <h1>
          <Link to="/">Learn and Play Blackjack</Link>
        </h1>
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="login">Login</Link></li>
          <li><Link to="login">Guest</Link></li>
        </ul>
      </nav>
    )
}

export default Navbar