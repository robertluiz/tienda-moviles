import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="page-container">
            <Header />
            <div className="main-content">
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout; 