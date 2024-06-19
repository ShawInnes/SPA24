import * as React from 'react';
import {Film} from '~/schemas/film';
import VideoPlayer from '~/components/VideoPlayer';
import {Checkbox} from '~/components/ui/checkbox';

type FilmComponentProps = {
  film: Film;
  selectedMovies: string[];
  onClickHandler: (filmId: string) => void;
};

const FilmComponent: React.FC<FilmComponentProps> = ({film, selectedMovies, onClickHandler}) => {
  return (
    <div className="flex flex-col bg-[#ffefd5] p-4 rounded-lg shadow-md my-2 mx-2">
      <div className="flex flex-row items-center">
        <Checkbox className="mx-2"
                  onClick={() => onClickHandler(film.movieId)}
                  checked={selectedMovies.includes(film.movieId)}
        />
        <div className="grow text-[#c62828] font-semibold text-lg">{film.englishTitle}</div>
        {film.trailerUrl && (<VideoPlayer trailerUrl={film.trailerUrl}/>)}
        {film.vimeoUrl && (<VideoPlayer trailerUrl={`https://vimeo.com/${film.vimeoUrl}`}/>)}
      </div>
    </div>
  );
};
export default FilmComponent;