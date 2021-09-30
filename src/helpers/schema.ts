import { string, object, ref } from 'yup';

export const password = string()
  .required('No password provided.')
  .min(8, 'Password should be 8 chars minimum.')
  .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.');
export const username = string().label('Username').min(5);

export const authForm = object().shape({
  username: string().required('You must provide a username').min(5, 'Username should be atleast 5 char in lenght'),
  password: string().required('You must provide a new password.')
    .when(['$loginWithFIDO2', '$action'], (loginWithFIDO2, action) => {
      if (loginWithFIDO2) return string().notRequired();
      if (action === 'register') {
        return string().min(8, 'Password length must be atleast 8 characters')
          .max(64, 'Password length must be atmost 64 characters')
          .matches(/^(?=.*[0-9]).+$/, 'Password must have at least 1 number')
          .matches(/^(?=.*[A-Z]).+$/, 'Password must have at least 1 uppercase character')
          .matches(/(?=.*[#?!@$%^&*-]).+/, 'Password must have at least 1 symbol');
      }
      return string().min(8, 'Invalid password');
    }),
  confirmPassword: string()
    .when(['$loginWithFIDO2', '$action'], (loginWithFIDO2, action) => {
      if (loginWithFIDO2 || (action !== 'register')) return string().notRequired();
      return string()
        .oneOf([ref('password'), null], 'New password and confirm password must match');
    }),
});
