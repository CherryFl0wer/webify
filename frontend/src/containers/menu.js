import React from 'react';
import { connect } from 'react-redux';
import '../assets/css/index.css';

const Menu = ({ title, elements }) => {

    return (
        <div id="sidebar-wrapper">
            <ul className={"sidebar-nav"}>
                <li className={"sidebar-brand"}>
                    <a href="#">
                        {title}
                    </a>
                </li>

                {
                    elements.map((d, idx) => {
                        return (<li key={idx}> <a href="#"> {d} </a> </li>)
                    })
                }
    
            </ul>
        </div>
    );
};


export default Menu;