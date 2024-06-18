import * as React from 'react';
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog';

import {lazy, Suspense} from 'react';

const ReactPlayer = lazy(() => import('react-player'));

type VideoPlayerProps = {
  trailerUrl: string
};
const VideoPlayer: React.FC<VideoPlayerProps> = ({trailerUrl}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
          Watch Trailer
        </div>
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