import  { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { pushDataLayer } from '../lib/analytics';
import Newsletter from '../components/Newsletter';
import './ProfilePage.css';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const { login, register } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = Object.fromEntries(new FormData(e.target).entries());
        try {
            await login(email, password);
            navigate('/profile-account');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid credentials';
            alert(errorMessage);
            
            pushDataLayer({
                event: 'form_submit_error',
                form_name: 'login_form',
                error_message: errorMessage
            });
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const userData = Object.fromEntries(new FormData(e.target).entries());
        try {
            await register(userData);
            navigate('/profile-account');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            alert(errorMessage);

            pushDataLayer({
                event: 'form_submit_error',
                form_name: 'create_account_form',
                error_message: errorMessage
            });
        }
    };

    return (
        <div className="ProfilePage-splitScreen">
            {/* Login Section */}
            <div className="ProfilePage-formContainer">
                <form onSubmit={handleLogin} className="ProfilePage-form">
                    <h2>Login</h2>
                    <p>Welcome back! Please enter your details.</p>
                    <div className="ProfilePage-inputGroup">
                        <label htmlFor="login-email">Email</label>
                        <input id="login-email" name="email" type="email" required />
                    </div>
                    <div className="ProfilePage-inputGroup">
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" name="password" type="password" required />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>

            {/* Divider Line */}
            <div className="ProfilePage-divider"></div>

            {/* Create Account Section */}
            <div className="ProfilePage-formContainer">
                <form onSubmit={handleCreateAccount} className="ProfilePage-form">
                    <h2>Create Account</h2>
                    <p>Join us and start shopping!</p>
                    <div className="ProfilePage-formRow">
                        <div className="ProfilePage-inputGroup">
                            <label htmlFor="create-firstname">First Name</label>
                            <input id="create-firstname" name="firstName" type="text" required />
                        </div>
                        <div className="ProfilePage-inputGroup">
                            <label htmlFor="create-lastname">Last Name</label>
                            <input id="create-lastname" name="lastName" type="text" required />
                        </div>
                    </div>
                    <div className="ProfilePage-inputGroup">
                        <label htmlFor="create-email">Email</label>
                        <input id="create-email" name="email" type="email" required />
                    </div>
                    <div className="ProfilePage-inputGroup">
                        <label htmlFor="create-password">Password</label>
                        <input id="create-password" name="password" type="password" required />
                    </div>
                    <div className="ProfilePage-formRow">
                        <div className="ProfilePage-inputGroup">
                            <label htmlFor="create-phone">Phone Number</label>
                            <input id="create-phone" name="phone" type="tel" />
                        </div>
                        <div className="ProfilePage-inputGroup">
                            <label htmlFor="create-city">City</label>
                            <input id="create-city" name="city" type="text" />
                        </div>
                        <div className="ProfilePage-inputGroup">
                            <label htmlFor="create-country">Country</label>
                            <input id="create-country" name="country" type="text" />
                        </div>
                    </div>
                    <button type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
