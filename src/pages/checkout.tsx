import { Typography } from '@mui/material';
import React from 'react';
import { DemoCheckout } from '../components/Checkout';
import LogJson from '../components/Log';
import { useAuthCtxData } from '../HOC/session';
import withAuthenticaion from '../HOC/session/ProtectedRoute';

const Checkout = () => {
  const { authPayload } = useAuthCtxData();
  return (
    <div>
      <DemoCheckout />
      {
        authPayload
        && (
          <>
            <Typography sx={{ color: 'green' }} variant="h4">
              Success:
            </Typography>
            <LogJson value={authPayload} />
          </>
        )
      }
    </div>
  );
};

export default withAuthenticaion(Checkout);
