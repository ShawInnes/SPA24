/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {LocaleContextProvider} from '~/providers/LocaleProvider';
import {TooltipProvider} from '~/components/ui/tooltip';

const locales = window.navigator.languages as string[];

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <TooltipProvider delayDuration={150}>
        <LocaleContextProvider locales={locales}>
          <RemixBrowser/>
        </LocaleContextProvider>
      </TooltipProvider>
    </StrictMode>,
  );
});
