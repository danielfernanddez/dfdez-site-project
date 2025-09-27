import { useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import SHA256 from 'crypto-js/sha256';
import { UserContext } from '../context/UserContext';

const PageAnalyticsTracker = () => {
    const location = useLocation();
    const { userInfo, isLoggedIn ,loading } = useContext(UserContext); // 1. Get the loading state
    const trackedPathname = useRef(null);
    const isInitialLoad = useRef(true);

    const hashData = (data) => data ? SHA256(data.toString().trim().toLowerCase()).toString() : "";

    useEffect(() => {
        // 2. Wait for the UserContext to finish loading
        if (loading) {
            return;
        }

        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        const pagePath = location.pathname + location.search;

        if (pagePath === trackedPathname.current) {
            return;
        }

        trackedPathname.current = pagePath;
        
        setTimeout(() => {
            const pageTitle = document.title;
            
            let userDataForDL = {};
            if (userInfo) {
                userDataForDL = {
                    user_fn_plain: userInfo.firstName,
                    user_ln_plain: userInfo.lastName,
                    user_em_plain: userInfo.email,
                    user_ph_plain: userInfo.phone,
                    user_ct_plain: userInfo.city,
                    user_co_plain: userInfo.country,
                    user_fn_hash: hashData(userInfo.firstName),
                    user_ln_hash: hashData(userInfo.lastName),
                    user_em_hash: hashData(userInfo.email),
                    user_ph_hash: hashData(userInfo.phone),
                    user_ct_hash: hashData(userInfo.city),
                    user_co_hash: hashData(userInfo.country),
                };
            }

            console.log(`Tracking page_view for: ${pagePath}`);

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'spa_page_view',
                page_path: pagePath,
                page_title: pageTitle,
                user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                user_id: userInfo?._id || undefined,
                user: userInfo ? userDataForDL : {},
            });
        }, 0);

    }, [location.pathname, location.search, userInfo, isLoggedIn, loading]); // 3. Add loading to the dependency array

    return null;
};

export default PageAnalyticsTracker;

