import { useEffect, ComponentType, FC } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useAuthCtxData, useAuthCtxFns } from './Authentication';

const withAuthenticaion = <P extends object>(Component: ComponentType<P>): FC<P> => props => {
  const { isLoggedIn } = useAuthCtxData();
  const { dispatch } = useAuthCtxFns();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      axios('/api/auth/isAuth')
        .then(res => {
          const savedResultString = localStorage.getItem(res.data.user.username);
          if (!savedResultString) {
            router.push('/login');
          } else {
            const userData = JSON.parse(savedResultString);
            dispatch({ type: 'AUTHENTICATE', payload: userData });
          }
        }).catch(err => {
          if (err.response.status === 401) {
            router.push('/login');
          } else {
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: err.message });
          }
        });
    }
  }, [dispatch, isLoggedIn, router]);

  return isLoggedIn ? <Component {...props as P} /> : (
    <div>
      <CircularProgress />
    </div>
  );
};

export default withAuthenticaion;
