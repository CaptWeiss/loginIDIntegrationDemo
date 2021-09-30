import '../styles/main.scss';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import Layout from '../HOC/Layout';
import AuthProvider from '../HOC/session';
import { theme } from '../styles/muiTheme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider {...{ theme }}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
