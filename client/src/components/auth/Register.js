import React, {Fragment, useState} from 'react'
import {Link} from 'react-router-dom';

export const Register = () => {
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
            console.log('passwords do not match')
        } else {
            console.log(formData)
        }
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
export default Register
