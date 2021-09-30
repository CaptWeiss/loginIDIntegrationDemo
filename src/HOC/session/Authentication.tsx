import { createContext, Dispatch, useMemo, useReducer, FC, useEffect, useContext, useCallback } from 'react';
import WebSDK from '@loginid/sdk';
import { Result } from '@loginid/sdk/base';
import axios from 'axios';
import { init, reducer } from './AuthReducer';
import type { TAuthAction, IAuthMeta } from './AuthReducer';
import { authenticate } from '../../helpers';
import { getAuthServiceToken } from '../../helpers/postAuth';

// export const prisma = new PrismaClient();

const fnsInit: IFnsInit = {
  dispatch: () => null,
  login: () => Promise.resolve(),
  register: () => Promise.resolve()
};

interface IFnsInit {
  LoginID?: WebSDK,
  login: TLogin,
  register: TRegister,
  dispatch: Dispatch<TAuthAction>
}

type TLogin = (FIDO2: boolean, username: string, password?: string) => Promise<void>;
type TRegister = (FIDO2: boolean, username: string, password?: string, confirmPassword?: string) => Promise<void>;

const AuthDataCtx = createContext(init);
AuthDataCtx.displayName = 'ADC';
const AuthFnxCtx = createContext(fnsInit);

const AuthenticationProvider:FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const LoginID = useMemo(
    () => new WebSDK(process.env.NEXT_PUBLIC_BASE_URL || '', process.env.NEXT_PUBLIC_CLIENT_ID || ''),
    []
  );

  useEffect(() => {
    // Check if user’s device and browser combination supports FIDO2
    LoginID.isFido2Supported()
      .then((supported) => {
        dispatch({ type: 'SET_IS_SUPPORTED', payload: supported });
      })
      .catch((err) => {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: err.message });
      });
  }, [LoginID]);

  useEffect(() => {
    if (!state.isLoggedIn) {
      axios('/api/auth/isAuth')
        .then(res => {
          const savedResultString = localStorage.getItem(res.data.user.username);
          if (savedResultString) {
            const userData = JSON.parse(savedResultString);
            dispatch({ type: 'AUTHENTICATE', payload: userData });
          }
        }).catch(err => {
          if (err.response.status === 401) {
            dispatch({ type: 'LOGOUT' });
          }
        });
    }
  }, [state.isLoggedIn]);

  const login: TLogin = useCallback(async (FIDO2, username, password): Promise<void> => {
    const serviceToken = await getAuthServiceToken('login');
    let result: Result | null = null;
    if (FIDO2) {
      result = await LoginID.authenticateWithFido2(username, {
        authorization_token: serviceToken
      });
    } else {
      if (!password) throw new Error('Password is required');

      result = await LoginID.authenticateWithPassword(username, password, {
        authorization_token: serviceToken
      });
    }
    if (!result) throw new Error();

    const { data } = await authenticate(username, result);
    dispatch({ type: 'AUTHENTICATE', payload: result });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: data.notifications });
  }, [LoginID]);

  const register: TRegister = useCallback(async (FIDO2, username, password, confirmPassword): Promise<void> => {
    const serviceToken = await getAuthServiceToken('register');
    let result: Result | null = null;
    if (FIDO2) {
      result = await LoginID.registerWithFido2(username, {
        authorization_token: serviceToken
      });
    } else {
      if (!password) throw new Error('Password is required');
      if (!confirmPassword) throw new Error('confirm password');

      result = await LoginID.registerWithPassword(username, password, confirmPassword, {
        authorization_token: serviceToken
      });
    }
    if (!result) throw new Error();

    const { data } = await authenticate(username, result);
    dispatch({ type: 'AUTHENTICATE', payload: result });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: data.notifications });
  }, [LoginID]);

  const fns = useMemo(() => ({
    dispatch,
    LoginID,
    login,
    register
  }), [LoginID, login, register]);

  return (
    <AuthFnxCtx.Provider value={fns}>
      <AuthDataCtx.Provider value={state}>
        {children}
      </AuthDataCtx.Provider>
    </AuthFnxCtx.Provider>
  );
};

export default AuthenticationProvider;

export const useAuthCtxData = (): IAuthMeta => useContext(AuthDataCtx);
export const useAuthCtxFns = (): IFnsInit => useContext(AuthFnxCtx);
