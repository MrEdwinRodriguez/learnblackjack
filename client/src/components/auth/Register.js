import React, {Fragment, useState} from 'react'
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from 'prop-types';


export const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: ""
    });

    const {first_name, last_name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if(password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            console.log(first_name)
            register({
                first_name: first_name, 
                last_name: last_name, 
                email: email, 
                password: password})
        }
    }

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Fragment>
            <section className="landing">
            <div className="dark-overlay">
            <div className='container'>
            <div className="signup-form">
                <form className="form" onSubmit={e => onSubmit(e)}>
                <h2>Register</h2>
                <p className="hint-text">Create your account. It's free and only takes a minute.</p>
                <div className="form-group">
                    <input type="text" className="form-control" name="first_name" placeholder="First Name" value={first_name} onChange={e => onChange(e)} required />    	
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="last_name" placeholder="Last Name"  value={last_name} onChange={e => onChange(e)} required/>      	
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password" placeholder="Password"  value={password} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password2" placeholder="Confirm Password"  value={password2} onChange={e => onChange(e)} required />
                </div>        
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">Register Now</button>
                </div>
                </form>
                <div className="text-center text-primary">Already have an account? <Link to="login" className="text-light">Sign In</Link></div>
            </div>
            </div></div>
            </section>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register);
