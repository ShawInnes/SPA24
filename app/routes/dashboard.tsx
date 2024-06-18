import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from '@remix-run/node';
import {NavLink, useLoaderData, useSubmit} from '@remix-run/react';

import films_data from '../../data/films.json';
import venue_data from '../../data/brisbane.json';

import {Film, filmsSchema} from '~/schemas/film';
import FilmComponent from '~/components/FilmComponent';
import {Session, venuesSchema} from '~/schemas/venue';
import SessionsComponent from '~/components/SessionsComponent';
import {Fragment} from 'react';
import {destroySession, getSession} from '~/services/session.server';
import {Button} from '~/components/ui/button';
import {kv} from '@vercel/kv';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const parsedFilms = filmsSchema.safeParse(films_data);

  if (!parsedFilms.success) {
    return json({movies: [], categories: [], sessions: [], error: parsedFilms.error.format()});
  }

  const parsedVenues = venuesSchema.safeParse(venue_data);
  if (!parsedVenues.success) {
    return json({movies: [], categories: [], sessions: [], error: parsedVenues.error.format()});
  }

  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.data.user?.accessToken;
  if (!accessToken) {
    return redirect('/', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  const profileId = session.data.user?.profile?.id;

  const selectedSessions = (await kv.hget<string[]>(profileId, 'selectedSessions')) ?? [];
  const selectedMovies = (await kv.hget<string[]>(profileId, 'selectedMovies')) ?? [];

  console.log('selectedSessions', selectedSessions);
  console.log('selectedMovies', selectedMovies);

  return json({
    movies: parsedFilms.data.pageProps.movies as Film[],
    categories: parsedFilms.data.pageProps.categories,
    sessions: parsedVenues.data.pageProps.venue.sessions as Session[],
    profile: session.data.user?.profile as object,
    selectedSessions: selectedSessions as string[],
    selectedMovies: selectedMovies as string[],
  });
};

export const action = async ({request}: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const profileId = session.data.user?.profile?.id;
  const formData = await request.formData();

  const selectedSessions = formData.get('selectedSessions');
  if (selectedSessions) {
    await kv.hset(profileId, {selectedSessions: selectedSessions});
  }

  const selectedMovies = formData.get('selectedMovies');
  if (selectedMovies) {
    await kv.hset(profileId, {selectedMovies: selectedMovies});
  }

  return {selectedSessions, selectedMovies};
};

export default function Index() {
  const {movies, categories, sessions, profile, selectedSessions, selectedMovies} = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const onSetSession = async (sessionId: string) => {
    if (selectedSessions.includes(sessionId)) {
      const tempValue = selectedSessions.filter((session) => session !== sessionId);
      submit({selectedSessions: JSON.stringify(tempValue)}, {method: 'POST'});
    } else {
      const tempValue = [...selectedSessions, sessionId];
      submit({selectedSessions: JSON.stringify(tempValue)}, {method: 'POST'});
    }
  };

  const onSetMovie = async (movieId: string) => {
    if (selectedMovies.includes(movieId)) {
      const tempValue = selectedMovies.filter((movie) => movie !== movieId);
      submit({selectedMovies: JSON.stringify(tempValue)}, {method: 'POST'});
    } else {
      const tempValue = [...selectedMovies, movieId];
      submit({selectedMovies: JSON.stringify(tempValue)}, {method: 'POST'});
    }
  };

  return (
    <div className="flex h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="gap-2 border-1 border-black">
        <div className="flex items-center border-b px-4 lg:h-[60px] lg:px-6">
          <h1 className="text-xl">Welcome to SPA24</h1>
        </div>
        <div className="p-4">
          <p>
            {profile?.displayName}
          </p>
          <Button>
            <NavLink to="/logout">Logout</NavLink>
          </Button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-scroll p-4">
          {categories.map((category) => (
              <div key={category}>
                <h1 className="text-lg font-bold">{category}</h1>
                {movies
                  .filter((movie: Film) => movie.categoryName === category)
                  .map((movie: Film) => (
                    <Fragment key={`${movie.categoryName}-${movie.slug}`}>
                      <FilmComponent
                        selectedMovies={selectedMovies}
                        onClickHandler={onSetMovie}
                        film={movie}/>
                      <SessionsComponent
                        debug={false}
                        onClickHandler={onSetSession}
                        selectedSessions={selectedSessions}
                        sessions={sessions.filter((session: Session) => session.movieId === movie.movieId)}/>
                    </Fragment>
                  ))}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
    ;
}
