import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@mui/material';
import axios from 'axios';
import { useAuthCtxData, useAuthCtxFns } from '../../HOC/session';

const links = [
  {
    id: 'nav1',
    name: 'Home',
    path: '/',
    protected: false
  },
  {
    id: 'nav3',
    name: 'Checkout',
    path: '/checkout',
    protected: true
  },
  // {
  //   id: 'nav4',
  //   name: 'Notification',
  //   path: '/notification',
  //   protected: true
  // },
  {
    id: 'nav5',
    name: 'Login',
    path: '/login',
    protected: false,
    auth: true
  },
  {
    id: 'nav6',
    name: 'Logout',
    action: 'logout',
    protected: true,
    auth: true
  },
];

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, authPayload } = useAuthCtxData();
  const { dispatch } = useAuthCtxFns();

  const onClick = async (id: string) => {
    if (id === 'nav6') {
      try {
        const { data: loggedOutUser } = await axios.post('/api/auth/logout');
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem(loggedOutUser);
      } catch (err) {
        dispatch({ type: 'LOGOUT' });
      }
    }
  };

  return (
    <ul className="top-bar">
      {authPayload
      && (
        <li className="username">
          {authPayload.user.username}
        </li>
      )}
      {links.map((link) => (
        <li
          key={link.id}
          id={link.id}
          className={`${
            router.asPath === link.path
              ? 'selected '
              : ''}${
            (link.protected && !isLoggedIn)
              ? 'hide '
              : ''}${
            (link.id === 'nav5' && isLoggedIn)
              ? 'hide '
              : ''
          }`}
        >
          {link.path
            ? <Link href={link.path}>{link.name}</Link>
            : (
              <Button
                id={link.id}
                onClick={() => onClick(link.id)}
                variant="outlined"
                size="small"
              >
                {link.name}
              </Button>
            )}
        </li>
      ))}
    </ul>
  );
};

export default Header;
