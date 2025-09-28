import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import SHA256 from 'crypto-js/sha256';
import { pushDataLayer } from '../lib/analytics';
import './Newsletter.css';

const Newsletter = ({ formLocation = 'homepage_promo' }) => {
    const { isLoggedIn } = useContext(UserContext);

    const hashData = (data) => data ? SHA256(data.toString().trim().toLowerCase()).toString() : "";

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;

        // Enhanced dataLayer push
        pushDataLayer({
            event: 'newsletter_subscription',
            form_location: formLocation,
            user_status: isLoggedIn ? 'logged_in' : 'guest',
            page_path: window.location.pathname,
            user : {
                user_em_plain: email,
                user_em_hash: hashData(email)
            }
        });

        alert(`Thank you for subscribing, ${email}!`);
        e.target.reset();
    };

    return (
        <section className="Newsletter">
            <div className="Newsletter-container">
                {/* Image Column */}
                <div className="Newsletter-imageContainer">
                    <img src="/images/heros/banner-newsletter-img.webp" alt="Person relaxing and reading a book" loading='lazy' />
                </div>

                {/* Content Column */}
                <div className="Newsletter-content">
                    <h1>Join the Newsletter!</h1>
                    <h2>Test the Gen Lead dataLayer push</h2>
                    <p>This Form is only for testing purposes. You're not going to receive spammy emails so feel free to use whatever email you want</p>
                    
                    <form onSubmit={handleSubmit} className="Newsletter-form">
                        <input type="email" placeholder="Enter your email here" required />
                        <button type="submit">
                            Push Push
                        </button>
                    </form>

                    <ul className="Newsletter-reassuranceList">
                        <li>I won't mail you</li>
                        <li>No spam, I hate it as well.</li>
                        <li>Test Gen Lead Push</li>
                        <li>Connect with me on <a className='Newsletter-linkedin' href="https://www.linkedin.com/in/danielfernanddez/"><strong>LinkedIn</strong></a> !!! (づ ◕‿◕ )づ</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
