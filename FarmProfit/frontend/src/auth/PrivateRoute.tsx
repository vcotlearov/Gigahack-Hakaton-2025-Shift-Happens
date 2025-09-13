/* eslint-disable @typescript-eslint/no-explicit-any */
// src/auth/PrivateRoute.tsx
import * as React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

type PrivateRouteProps = {
    component: React.ComponentType<any>;
    path: string;
    exact?: boolean;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    return (
        <Route
            {...rest}
            render={(props) => (
                <AuthGuard
                    isAuthenticated={isAuthenticated}
                    isLoading={isLoading}
                    loginWithRedirect={loginWithRedirect}
                    returnTo={props.location.pathname}
                >
                    <Component {...props} />
                </AuthGuard>
            )}
        />
    );
};

function AuthGuard({
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    returnTo,
    children,
}: {
    isAuthenticated: boolean;
    isLoading: boolean;

    loginWithRedirect: (opts?: any) => Promise<void>;
    returnTo: string;
    children: React.ReactNode;
}) {
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect({ appState: { returnTo } });
        }
    }, [isLoading, isAuthenticated, loginWithRedirect, returnTo]);

    if (isLoading || !isAuthenticated) return null; // можно показать спиннер
    return <>{children}</>;
}
