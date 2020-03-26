import React from 'react';
import Head from 'next/head';
import nextConnect from 'next-connect';
import redirectTo from '../../lib/redirectTo';

const ResetPasswordTokenPage = ({ valid, token }) => {
  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      password: event.currentTarget.password.value,
      token,
    };

    const res = await fetch('/api/user/password/reset', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) redirectTo('/');
  }

  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <h2>Forget password</h2>
      {valid ? (
        <>
          <p>Enter your new password.</p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                name="password"
                type="password"
                placeholder="New password"
              />
            </div>
            <button type="submit">Set new password</button>
          </form>
        </>
      ) : (
        <p>This link may have been expired</p>
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  // eslint-disable-next-line global-require
  const database = require('../../middlewares/database');
  const handler = nextConnect();
  handler.use(database);
  const { token } = ctx.query;

  const tokenDoc = await ctx.req.db.collection('tokens').findOne({
    token: ctx.req.query.token,
    type: 'passwordReset',
  });

  return { props: { token, valid: !!tokenDoc } };
}

export default ResetPasswordTokenPage;
