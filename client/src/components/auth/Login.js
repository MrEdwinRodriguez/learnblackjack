import React,{Fragment, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = e => {
        e.preventDefault();
        login(email, password);
    }

    //redirect if logged in
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Fragment>
            <section className="landing">
            <div className="dark-overlay">
            <div className='container fill'>
            <div className="signup-form">
                <form className="form" onSubmit={e => onSubmit(e)}>
                <h2>Sign In</h2>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password" placeholder="Password"  value={password} onChange={e => onChange(e)} required />
                </div>     
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">Login Now</button>
                </div>
                </form>
                <div className="text-center text-primary">Forgot Password? <Link to="register" className="text-light">Send Password</Link></div>
                <div className="text-center text-primary">Don't have an account? <Link to="register" className="text-light">Registr</Link></div>
            </div>
            </div></div>
            </section>
        </Fragment>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
