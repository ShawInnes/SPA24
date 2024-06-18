import {ActionFunctionArgs, json, MetaFunction} from '@remix-run/node';
import {Form, useLoaderData} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Spanish Film Festival 2024'},
    {name: 'description', content: 'Welcome to SPA24!'},
    {
      property: 'og:image',
      content: 'https://shawinnes.com/assets/images/security-through-obscurity-ff324d41f67425d9c5e7ae59a45a76a8.webp',
    },
  ];
};

import films_data from '../../data/films.json';
import venue_data from '../../data/brisbane.json';

import {Film, filmsSchema} from '~/schemas/film';
import FilmComponent from '~/components/FilmComponent';
import {Session, venuesSchema} from '~/schemas/venue';
import SessionsComponent from '~/components/SessionsComponent';
import {Fragment, useLayoutEffect, useState} from 'react';
import {authenticator} from '~/services/auth.server';

export const loader = async () => {
  const parsedFilms = filmsSchema.safeParse(films_data);

  if (!parsedFilms.success) {
    return json({movies: [], categories: [], sessions: [], error: parsedFilms.error.format()});
  }

  const parsedVenues = venuesSchema.safeParse(venue_data);
  if (!parsedVenues.success) {
    return json({movies: [], categories: [], sessions: [], error: parsedVenues.error.format()});
  }

  return json({
    movies: parsedFilms.data.pageProps.movies,
    categories: parsedFilms.data.pageProps.categories,
    sessions: parsedVenues.data.pageProps.venue.sessions,
  });
};

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    await authenticator.authenticate('oauth2-strategy', request, {
      successRedirect: '/',
    });
    return {error: null};
  } catch (error) {
    // This allows us to return errors to the page without triggering the error boundary.
    if (error instanceof Response && error.status >= 400) {
      return {error: (await error.json()) as {message: string}};
    }
    throw error;
  }
};

export default function Index() {
  const {movies, categories, sessions} = useLoaderData<typeof loader>();
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
        <div>
          <Form method="post">
            <button type="submit">Log In</button>
          </Form>
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
