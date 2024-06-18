import {redirect} from '@remix-run/node';

import {destroySession, getSession} from '~/services/session.server';

export const loader = async () => {
  const session = await getSession();
  await destroySession(session);

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  })
}
