import * as React from 'react';
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog';

import {lazy, Suspense} from 'react';
import {FilmIcon} from '@heroicons/react/24/outline';

const ReactPlayer = lazy(() => import('react-player'));

type VideoPlayerProps = {
  trailerUrl: string
};
const VideoPlayer: React.FC<VideoPlayerProps> = ({trailerUrl}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <FilmIcon className="h-6 w-6"/>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <Suspense fallback={<div>Loading</div>}>
          <ReactPlayer url={trailerUrl}
                       playing
                       controls
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;