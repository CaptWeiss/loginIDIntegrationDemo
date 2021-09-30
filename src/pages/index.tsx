import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => (
  <div>
    <Head>
      <title>Demo App</title>
      <meta name="description" content="LoginID Secured Authentication demo app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <h1 className="title">
      Welcome to
      <a href="https://loginid.io/" rel="noreferrer noopener">
        LoginID
      </a>
      DemoApp
    </h1>
  </div>
);

export default Home;
