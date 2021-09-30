/**
 * This Registers with FIDO2 only.
 * Proccess will fail if the device or browser does not support FIDO2
 */
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, TextField, Switch } from '@mui/material';
import { useAuthCtxData, useAuthCtxFns } from '../../HOC/session';
import { Form } from '../Form';
import { LoginLink } from '../Login';
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
  user: any
}

const init: IState = {
  loading: false,
  errorMessage: null,
  showPassword: false,
  user: null,
};

const Register = () => {
  const [state, setState] = useState<IState>(init);
  const [loginWithFIDO2, setLoginWithFIDO2] = useState(true);
  const { isSupported } = useAuthCtxData();
  const { register, dispatch } = useAuthCtxFns();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
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
      const confirmPassword = confirmPasswordRef.current?.value;
      try {
        schema.authForm.validateSync({ username, password, confirmPassword }, {
          context: { action: 'register', loginWithFIDO2 },
          abortEarly: false
        });
      } catch (error: any) {
        setState({ ...state, loading: false, errorMessage: error.errors[0] });
        return;
      }
      await register(loginWithFIDO2, username, password, confirmPassword);
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
    <Form {...{ onSubmit, error: state.errorMessage, formLabel: 'Register' }}>
      <div className="switch">
        <span className="label">Register with FIDO2</span>
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
        inputMode="text"
        required
        placeholder="captweiss"
      />
      {!loginWithFIDO2 && (
      <>
        <TextField
          classes={{ root: 'text' }}
          autoComplete="new-password"
          type={state.showPassword ? 'text' : 'password'}
          inputRef={passwordRef}
          label="Password"
          onClick={handleClick}
          InputProps={{
            endAdornment: <ShowPassword show={state.showPassword} />
          }}
          title="Password is required because your device doesn't support FIDO2"
        />
        <TextField
          classes={{ root: 'text' }}
          autoComplete="off"
          type={state.showPassword ? 'text' : 'password'}
          inputRef={confirmPasswordRef}
          label="Confirm Password"
          onClick={handleClick}
          InputProps={{
            endAdornment: <ShowPassword show={state.showPassword} />
          }}
          title="Password is required because your device doesn't support FIDO2"
        />
      </>
      )}
      <LoginLink />
      <div className="form-error">{state.errorMessage}</div>
      <Button disabled={state.loading} variant="contained" type="submit">
        {state.loading ? 'Processing...' : 'Register'}
      </Button>
    </Form>
  );
};

export default Register;

export function RegisterLink() {
  return (
    <p className="action-link">
      You don&apos;t have an account?
      <span>
        <Link href="/register">Register</Link>
      </span>
    </p>
  );
}
