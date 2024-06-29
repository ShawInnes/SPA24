import * as React from 'react';
import {Film} from '~/schemas/film';
import VideoPlayer from '~/components/VideoPlayer';
import FilmHeaderComponent from '~/components/FilmHeaderComponent';
import {LinkIcon} from '@heroicons/react/24/solid';

type FilmComponentProps = {
  film: Film;
  selectedMovies: string[];
  onClickHandler: (filmId: string) => void;
};

const FilmComponent: React.FC<FilmComponentProps> = ({film, selectedMovies, onClickHandler}) => {
  const isSelected = selectedMovies.includes(film.movieId);

  return (
    <div data-isselected={isSelected} className="flex flex-col bg-amber-50
    data-[isselected=true]:bg-amber-300
    data-[isselected=true]:border-red-500
    data-[isselected=true]:border-4
    p-3 rounded-lg shadow-md my-2 mx-2">
      <div className="flex flex-row items-center">
        <div className="grow flex-row">
          <FilmHeaderComponent film={film} selectedMovies={selectedMovies} onClickHandler={onClickHandler}/>
        </div>
        <div className="pe-2">
          <a href={`https://spanishfilmfestival.com/films/${film.slug}`} target="_blank" rel="noreferrer">
            <LinkIcon className="h-6 w-6"/>
          </a>
        </div>
        {film.trailerUrl && (<VideoPlayer trailerUrl={film.trailerUrl}/>)}
        {film.vimeoUrl && (<VideoPlayer trailerUrl={`https://vimeo.com/${film.vimeoUrl}`}/>)}
      </div>
    </div>
  );
};
export default FilmComponent;

