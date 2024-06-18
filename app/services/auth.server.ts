import {Authenticator} from 'remix-auth';
import {sessionStorage} from '~/services/session.server';

interface User {
  accessToken: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

import {GoogleStrategy} from 'remix-auth-google';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID ?? '',
    clientSecret: process.env.CLIENT_SECRET ?? '',
    callbackURL: process.env.CALLBACK_URL ?? '',
  },
  async ({accessToken, refreshToken, extraParams, profile}) => {
    // Get the user data from your DB or API using the tokens and profile
    return {accessToken, profile};
  },
);

authenticator.use(googleStrategy);