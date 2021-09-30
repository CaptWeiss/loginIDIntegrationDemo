import { Result } from '@loginid/sdk/base';
import { Notification } from '.prisma/client';

export const init:IAuthMeta = {
  isLoggedIn: false,
  isSupported: true,
  token: null,
  errorMessage: null,
  successMessage: null,
  notifications: []
};

function authenticate(state: IAuthMeta, authPayload: Result): IAuthMeta {
  const newState = {
    ...state,
    authPayload,
    errorMessage: null,
    isLoggedIn: true
  };
  return newState;
}

export function reducer(state: IAuthMeta, action: TAuthAction): IAuthMeta {
  switch (action.type) {
    case 'AUTHENTICATE':
      return authenticate(state, action.payload);

    case 'SET_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload
      };

    case 'SET_SUCCESS_MESSAGE':
      return {
        ...state,
        successMessage: action.payload
      };

    case 'SET_IS_SUPPORTED':
      return {
        ...state,
        isSupported: action.payload
      };

    case 'IS_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: action.payload
      };

    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      };

    case 'LOGOUT':
      return { ...init };

    default:
      return state;
  }
}

export interface IAuthMeta {
  isSupported: boolean;
  isLoggedIn: boolean;
  authPayload?: Result;
  token: string | null;
  errorMessage: string | null;
  successMessage: object | null;
  notifications: Notification[];
}

export type TAuthAction = | {
  type: 'LOGOUT'
} | {
  type: 'SET_IS_SUPPORTED',
  payload: boolean
} | {
  type: 'AUTHENTICATE',
  payload: Result
} | {
  type: 'IS_LOGGED_IN',
  payload: boolean
} | {
  type: 'SET_NOTIFICATIONS',
  payload: Notification[]
} | {
  type: 'SET_ERROR_MESSAGE',
  payload: string
} | {
  type: 'SET_SUCCESS_MESSAGE',
  payload: object | null
};
