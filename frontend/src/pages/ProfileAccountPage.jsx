import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './ProfileAccountPage.css'; // <-- THIS LINE HAS BEEN CORRECTED

const ProfileAccountPage = () => {
    const { userInfo, isLoggedIn, logout, loading: userLoading } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading) {
            return;
        }

        if (!isLoggedIn) {
            navigate('/profile');
        } else {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    
                    const { data } = await axios.get('http://localhost:5001/api/orders/myorders', config);
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
                setLoadingOrders(false);
            };
            fetchOrders();
        }
    }, [isLoggedIn, userLoading, navigate, userInfo]);

    const handleLogout = () => {
        logout();
    };

    if (userLoading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading account...</div>;
    }
    
    if (!userInfo) {
        return null; 
    }

    return (
        <div className="ProfileAccountPage">
            <div className="ProfileAccountPage-details">
                <h2>My Profile</h2>
                <p><strong>First Name:</strong> {userInfo.firstName}</p>
                <p><strong>Last Name:</strong> {userInfo.lastName}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Phone:</strong> {userInfo.phone}</p>
                <p><strong>City:</strong> {userInfo.city}</p>
                <p><strong>Country:</strong> {userInfo.country}</p>
                <button onClick={handleLogout} className="ProfileAccountPage-logoutButton">Log Out</button>
            </div>

            <div className="ProfileAccountPage-orderHistory">
                <h2>Order History</h2>
                {loadingOrders ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div className="ProfileAccountPage-noOrders">
                        <p>You haven't placed any order yet.</p>
                        <Link to="/products" className='ProfileAccountPage-noOrders-link'>Start Shopping</Link>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="ProfileAccountPage-orderCard">
                            <div className="ProfileAccountPage-orderHeader">
                                <span><strong>Order ID:</strong> {order._id}</span>
                                <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span><strong>Total:</strong> €{(order.totalPrice + 3).toFixed(2)}</span>
                            </div>
                            <div className="ProfileAccountPage-orderItems">
                                {order.orderItems.map(item => (
                                    <div key={item._id || item.sku} className="ProfileAccountPage-orderItem">
                                        <img src={item.image} alt={item.name} />
                                        <p>{item.name} (x{item.quantity})</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfileAccountPage;
