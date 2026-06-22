import { useEffect, useSyncExternalStore } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { getAccessToken, isAdminAuthorized } from '../services/authStore';

const subscribe = () => () => {};

const getClientAuth = () => Boolean(getAccessToken() && isAdminAuthorized());

export default function RequireAdmin() {
  const navigate = useNavigate();
  const isAuthorized = useSyncExternalStore(subscribe, getClientAuth, () => false);

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/login', { replace: true });
    }
  }, [isAuthorized, navigate]);

  if (!isAuthorized) {
    return null;
  }

  return <Outlet />;
}
