import { FC } from 'react';
import { Header } from '../components/Header';

const Layout: FC = ({ children }) => (
  <div className="container">
    <Header />
    <main>
      {children}
    </main>
  </div>
);

export default Layout;
