import {Authenticator} from 'remix-auth';
import {sessionStorage} from '~/services/session.server';
import {OAuth2Profile, OAuth2Strategy} from 'remix-auth-oauth2';

interface User {
  accessToken: string;
  profile: OAuth2Profile;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new OAuth2Strategy<
    User,
    {provider: 'oauth2-strategy'},
    {id_token: string}
  >(
    {
      clientId: process.env.CLIENT_ID ?? '',
      clientSecret: process.env.CLIENT_SECRET ?? '',

      authorizationEndpoint: `https://facebook.com/v20.0/dialog/oauth`,
      tokenEndpoint: `https://graph.facebook.com/v20.0/oauth/access_token`,
      redirectURI: 'http://localhost:5173/auth/callback' //'https://spa-24.vercel.app/auth/callback',
    },
    ({tokens, profile}) => {
      // here you can use the params above to get the user and return it
      // what you do inside this and how you find the user is up to you
      return {tokens, profile};
    },
  ),
  'oauth2-strategy',
);

