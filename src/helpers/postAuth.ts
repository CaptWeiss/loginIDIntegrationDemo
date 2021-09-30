// Action to perfomr after authentication
import { Result } from '@loginid/sdk/base';
import axios, { AxiosResponse } from 'axios';
import { Notification, User } from '.prisma/client';

/**
 * Stores jwt in browser cookie and result to brower's local storage
 */
export function authenticate(username: string, result: Result) {
  const { jwt, ...resultWithoutJwt } = result;
  localStorage.setItem(username, JSON.stringify(resultWithoutJwt));
  return axios.post<Result, AxiosResponse<User & { notifications: Notification[] }>>('/api/auth/login', result);
}

export async function getAuthServiceToken(action: 'login' | 'register') {
  const { data: { serviceToken } } = await axios.get<{ serviceToken: string }>(`/api/getServiceToken/auth/${action}`);
  return serviceToken;
}
