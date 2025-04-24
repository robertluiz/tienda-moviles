import { ReactNode } from 'react';
import Header from '../Header/Header';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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