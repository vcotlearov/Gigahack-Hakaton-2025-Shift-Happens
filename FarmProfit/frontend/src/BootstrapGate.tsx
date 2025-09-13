import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useApi } from './lib/api';

export function BootstrapGate() {
    const { isAuthenticated } = useAuth0();
    const { fetchApi } = useApi();
    const history = useHistory();

    useEffect(() => {
        if (!isAuthenticated) return;
        (async () => {
            try {
                const me = await fetchApi<{ hasProfile: boolean }>('/me');
                if (!me.hasProfile) history.replace('/https://farm-profit-webapp.azurewebsites.net/api/users/all');
            } catch (e) {
                console.error(e);
            }
        })();
    }, [isAuthenticated, fetchApi, history]);

    return null;
}
