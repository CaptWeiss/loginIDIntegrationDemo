import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button
} from '@mui/material';
import { red } from '@mui/material/colors';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useAuthCtxData, useAuthCtxFns } from '../../HOC/session';
import LogJson from '../Log';

const productDetail = {
  productName: 'Shrimp and Chorizo Paella',
  price: 150
};

export default function RecipeReviewCard() {
  const [loading, setLoading] = useState(false);
  const { LoginID, dispatch } = useAuthCtxFns();
  const { authPayload, successMessage } = useAuthCtxData();

  const verifyTransaction = async () => {
    const txPayload = JSON.stringify(productDetail);
    const nonce = `${Date.now()}`;
    setLoading(true);
    try {
      if (LoginID && authPayload) {
        const { data: { serviceToken: txAuthToken } } = await axios('/api/getServiceToken/tx/create', {
          params: { txPayload }
        });
        const { user: { username } } = authPayload;
        const tx = await LoginID.createAndConfirmTransaction(username, txPayload, {
          authorization_token: txAuthToken,
          nonce
        });
        const decoded = jwtDecode(tx.jwt, { header: true });
        const { data } = await axios.post('/api/tx/verify', {
          txPayload,
          txToken: tx.jwt
        });
        dispatch({
          type: 'SET_SUCCESS_MESSAGE',
          payload: {
            username, txPayload, txAuthToken, tx, decoded, valid: data.valid
          }
        });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={(
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        )}
        title="Shrimp and Chorizo Paella"
        subheader="$ 150"
      />
      <Image
        src="https://mui.com/static/images/cards/paella.jpg"
        height={194}
        width={345}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          disabled={loading}
          onClick={verifyTransaction}
        >
          Pay Now
        </Button>
      </CardActions>
      {
        successMessage
        && <LogJson value={successMessage} />
      }
    </Card>
  );
}
