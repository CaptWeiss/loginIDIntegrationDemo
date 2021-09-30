import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button, TextField, Switch } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuthCtxData, useAuthCtxFns } from '../../HOC/session';
import { Form } from '../Form';
import { RegisterLink } from '../Register';
import ShowPassword from '../ShowPassword';
import { schema } from '../../helpers';

interface FormExt extends HTMLFormElement {
  username: string;
  password?: string;
}
interface IState {
  loading: boolean,
  errorMessage: string | null,
  showPassword: boolean,
}

const init: IState = {
  loading: false,
  errorMessage: null,
  showPassword: false
};

const Login = () => {
  const [state, setState] = useState<IState>(init);
  const [loginWithFIDO2, setLoginWithFIDO2] = useState(true);
  const { dispatch, login } = useAuthCtxFns();
  const { isSupported, authPayload } = useAuthCtxData();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setLoginWithFIDO2(isSupported);
  }, [isSupported]);

  const toggle = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginWithFIDO2(event.target.checked);
  };

  async function onSubmit(e: React.FormEvent<FormExt>) {
    e.preventDefault();
    setState({ ...state, loading: true });
    try {
      const username = usernameRef.current?.value || '';
      const password = passwordRef.current?.value;
      try {
        schema.authForm.validateSync({ username, password }, {
          context: { action: 'login', loginWithFIDO2 },
          abortEarly: false
        });
      } catch (error: any) {
        setState({ ...state, loading: false, errorMessage: error.errors[0] });
        return;
      }
      await login(loginWithFIDO2, username, password);
      setState({ ...state, loading: false });
      router.replace('/checkout');
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: error });
      setState({ ...state, loading: false, errorMessage: error.message });
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const targetEl = e.target as unknown as EventTarget & HTMLDivElement;
    const showPasswordClicked = targetEl.dataset.paswordVisibility;
    if (showPasswordClicked) setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <Form {...{ onSubmit, error: state.errorMessage, data: authPayload, formLabel: 'Login' }}>
      <div className="switch">
        <span className="label">Login with FIDO2</span>
        <Switch
          {...{
            inputProps: { 'aria-label': 'Register with FIDO2' },
            checked: loginWithFIDO2
          }}
          onChange={toggle}
        />
        {
          (loginWithFIDO2 && !isSupported)
          && <p>FIDO2 is not supported on this browser/device </p>
        }
      </div>
      <TextField
        classes={{ root: 'text' }}
        autoComplete="username"
        inputRef={usernameRef}
        label="Username"
        name="username"
      />
      {!loginWithFIDO2
        && (
        <TextField
          classes={{ root: 'text' }}
          autoComplete="current-password"
          type={state.showPassword ? 'text' : 'password'}
          inputRef={passwordRef}
          label="Password"
          onClick={handleClick}
          InputProps={{
            endAdornment: <ShowPassword show={state.showPassword} />
          }}
          title="Password is required because your device doesn't support FIDO2"
        />
        )}
      <RegisterLink />
      <Button disabled={state.loading} variant="contained" type="submit">
        {state.loading ? 'Processing...' : 'Login'}
      </Button>
    </Form>
  );
};

export default Login;

export function LoginLink() {
  return (
    <p className="action-link">
      Have an account already?
      <span>
        <Link href="/login">Login</Link>
      </span>
    </p>
  );
}
