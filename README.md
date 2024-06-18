# Welcome to Spanish Film Festival 2024!

Demo: https://spa-24.vercel.app/

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Data

This is using data from the spanish film festival website:

* https://spanishfilmfestival.com/_next/data/556m7wsHQVrGTcwI-f28F/venues/Brisbane.json
* https://spanishfilmfestival.com/_next/data/556m7wsHQVrGTcwI-f28F/films.json
* https://spanishfilmfestival.com/films/the-teacher-who-promised-the-sea
