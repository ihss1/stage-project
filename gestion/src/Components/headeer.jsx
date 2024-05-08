import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import navStyles from '../Style/header.module.css';

export const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userName = "John";

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className={navStyles.navbar}>
            <div className={navStyles.logo}>
                <p>dark trace</p>
            </div>
            <ul className={navStyles.filters}>
                <li>
                    <NavLink to='/appliance'className={({ isActive }) => (isActive ? navStyles.active : '')}>appliance</NavLink>
                </li>
                <li>
                    <NavLink to='/client'className={({ isActive }) => (isActive ? navStyles.active : '')}>client</NavLink>
                </li>
                <li>
                    <NavLink to='/pov'className={({ isActive }) => (isActive ? navStyles.active : '')}>pov</NavLink>
                </li>
            </ul>
                <div className={navStyles.loginbtn}>
                    
                </div>
        </div>
    );
};
