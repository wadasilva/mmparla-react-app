import React from 'react';
import { Navigate, Route, useLocation, useNavigate } from 'react-router-dom';
import auth from '../../services/authService';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const location = useLocation();
    if (auth.getCurrentUser()) {
        return (<Component {...rest} />)
    } 

    return <Navigate state={{ from: location }} to={{ pathname: '/auth' }} />;
};

export default ProtectedRoute;