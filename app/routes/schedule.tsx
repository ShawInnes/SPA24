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
import CategoryComponent from '~/components/CategoryComponent';
import {Calendar} from '~/components/ui/calendar';
import dayjs from 'dayjs';

export const loader: any = async ({request}: LoaderFunctionArgs) => {
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

  return json({
    movies: parsedFilms.data.pageProps.movies as Film[],
    categories: parsedFilms.data.pageProps.categories as string[],
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

export const getSelectedSessions = (sessions: Session[], selectedSessions: string[]) => {
  const filteredSessions = sessions.filter((session) => selectedSessions.includes(session.sessionId));
  return filteredSessions.map(p => dayjs(p.showtimeDate.replace('Z', '')).toDate());
};

export const getSelectedMovie = (movies: Film[], movieId: string): Film => {
  return movies.find((movie) => movie.movieId === movieId) as Film;
};

export default function Index() {
  const {movies, sessions, profile, selectedSessions, selectedMovies} = useLoaderData<typeof loader>();
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

  return (
    <>
      <div
        className="lg:hidden md:hidden border-gray-300 bg-white shadow-lg">
        <div className="mt-auto flex-col">
          <Button className="m-2">
            <NavLink to="/schedule">My Schedule</NavLink>
          </Button>
          <Button className="m-2">
            <NavLink to="/logout">Logout</NavLink>
          </Button>
        </div>
      </div>
      <div className="flex h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div
          className="hidden md:block lg:block gap-2 border-r border-gray-300 bg-white shadow-lg flex flex-col h-full md:max-w-[220px] lg:max-w-[280px]">
          <div className="flex items-center border-b px-4 lg:h-[60px] lg:px-6 bg-yellow-300">
            <h1>Welcome to SPA24</h1>
          </div>
          <div className="flex flex-grow flex-col p-4 items-center">
            <div>{profile?.displayName}</div>
            <div className="pt-4">
              {selectedMovies.length} selected movies
            </div>
            <div className="mt-auto">
              <Button className="m-2">
                <NavLink to="/dashboard">Full List</NavLink>
              </Button>
              <Button>
                <NavLink to="/logout">Logout</NavLink>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-scroll pl-2">
            {selectedMovies.map((movieId) => {
              const movie = getSelectedMovie(movies, movieId);
              return (
                <div key={movieId}>
                  <h1>{movie.englishTitle}</h1>
                  <SessionsComponent
                    sessions={sessions.filter((session: Session) => session.movieId === movie.movieId)}
                    selectedSessions={selectedSessions}
                    onClickHandler={onSetSession}
                  />
                </div>);
            })}
          </div>
        </div>
      </div>
    </>
  );
}
