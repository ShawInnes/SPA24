import {LoaderFunctionArgs, MetaFunction} from '@remix-run/node';
import {Form, Outlet} from '@remix-run/react';
import {authenticator} from '~/services/auth.server';
import {Button} from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [
    {title: 'Spanish Film Festival 2024'},
    {name: 'description', content: 'Welcome to SPA24!'},
  ];
};


export const loader = async ({request}: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
};

export default function Index() {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="pb-4 text-xl">Welcome to SPA24</h1>

        <Form action="/auth/google" method="post">
          <Button>Login with Google</Button>
        </Form>
      </div>
    </div>
  );
}
