import {json, LoaderFunctionArgs, redirect} from '@remix-run/node';
import {Form, NavLink, useLoaderData} from '@remix-run/react';

import films_data from '../../data/films.json';
import venue_data from '../../data/brisbane.json';

import {Film, filmsSchema} from '~/schemas/film';
import FilmComponent from '~/components/FilmComponent';
import {Session, venuesSchema} from '~/schemas/venue';
import SessionsComponent from '~/components/SessionsComponent';
import {Fragment, useLayoutEffect, useState} from 'react';
import {destroySession, getSession} from '~/services/session.server';
import {Button} from '~/components/ui/button';

export const loader = async ({request} : LoaderFunctionArgs) => {
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

  return json({
    movies: parsedFilms.data.pageProps.movies,
    categories: parsedFilms.data.pageProps.categories,
    sessions: parsedVenues.data.pageProps.venue.sessions,
    profile: session.data.user?.profile,
  });
};

export default function Index() {
  const {movies, categories, sessions, profile} = useLoaderData<typeof loader>();
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);

  useLayoutEffect(() => {
    const loadedSelectedSessions = window.localStorage.getItem('selectedSessions');
    console.log('loadedSelectedSessions', loadedSelectedSessions);
    if (loadedSelectedSessions) {
      setSelectedSessions(JSON.parse(loadedSelectedSessions));
    }

    const loadedSelectedMovies = window.localStorage.getItem('selectedMovies');
    if (loadedSelectedMovies) {
      setSelectedMovies(JSON.parse(loadedSelectedMovies));
    }
  }, []);

  const onSetSession = (sessionId: string) => {
    if (selectedSessions.includes(sessionId)) {
      const tempValue = selectedSessions.filter((session) => session !== sessionId);
      setSelectedSessions(tempValue);
      window.localStorage.setItem('selectedSessions', JSON.stringify(tempValue));
    } else {
      const tempValue = [...selectedSessions, sessionId];
      setSelectedSessions(tempValue);
      window.localStorage.setItem('selectedSessions', JSON.stringify(tempValue));
    }
  };

  const onSetMovie = (movieId: string) => {
    if (selectedMovies.includes(movieId)) {
      const tempValue = selectedMovies.filter((movie) => movie !== movieId);
      setSelectedMovies(tempValue);
      window.localStorage.setItem('selectedMovies', JSON.stringify(tempValue));
    } else {
      const tempValue = [...selectedMovies, movieId];
      setSelectedMovies(tempValue);
      window.localStorage.setItem('selectedMovies', JSON.stringify(tempValue));
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
          {JSON.stringify(selectedMovies)}
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
