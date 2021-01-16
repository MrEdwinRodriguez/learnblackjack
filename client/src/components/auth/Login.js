import React,{Fragment, useState} from 'react';
import {Link} from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = e => {
        e.preventDefault();
        console.log(formData) 
    }
    return (
        <Fragment>
            <section className="landing">
            <div className="dark-overlay">
            <div className='container'>
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
                    <button type="submit" className="btn btn-primary btn-lg btn-block">Register Now</button>
                </div>
                </form>
                <div className="text-center text-primary">Forgot Password? <Link to="register" className="text-light">Send Password</Link></div>
                <div className="text-center text-primary">Don't have an account? <Link to="register" className="text-light">Register</Link></div>
            </div>
            </div></div>
            </section>
        </Fragment>
    )
}

export default Login
