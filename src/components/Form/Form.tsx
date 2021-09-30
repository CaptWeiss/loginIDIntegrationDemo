import { FC, FormEvent } from 'react';
import { Typography } from '@mui/material';

interface IFormProp {
  error?: string | null;
  formLabel: string;
  onSubmit(event: FormEvent<HTMLFormElement>): void;
}

const Form:FC<IFormProp> = ({ children, ...props }) => (
  <form className="login-form" onSubmit={props.onSubmit}>
    <fieldset>
      <legend>
        {props.formLabel}
        : &nbsp;
      </legend>
      {children}
    </fieldset>
    {
      props.error
      && (
        <Typography>
          Error:
          {' '}
          <br />
          {props.error}
        </Typography>
      )
    }
  </form>
);

Form.defaultProps = {
  error: undefined
};

export default Form;
