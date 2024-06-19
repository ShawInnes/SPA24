import * as React from 'react';
import {Checkbox} from '~/components/ui/checkbox';
import {Film} from '~/schemas/film';

type FilmHeaderComponentProps = {
  film: Film;
  selectedMovies: string[];
  onClickHandler: (filmId: string) => void;
};

const FilmHeaderComponent: React.FC<FilmHeaderComponentProps> = ({film, selectedMovies, onClickHandler}) => {
  return (
    <>
      <Checkbox id={`interested-${film.movieId}`}
                onClick={() => onClickHandler(film.movieId)}
                checked={selectedMovies.includes(film.movieId)}
      />
      <label htmlFor={`interested-${film.movieId}`}
             className="pl-2 text-[#c62828] font-semibold text-lg cursor-pointer">{film.englishTitle}</label>
    </>
  );
};

export default FilmHeaderComponent;