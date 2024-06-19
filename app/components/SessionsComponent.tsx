import * as React from 'react';
import {Session} from '~/schemas/venue';
import {IntlDate} from '~/components/IntlDate';
import {IntlTime} from '~/components/IntlTime';
import {Tooltip, TooltipContent, TooltipTrigger} from '~/components/ui/tooltip';

type SessionsComponentProps = {
  sessions: Session[];
  selectedSessions: string[];
  cinemaId?: string;
  debug?: boolean;
  onClickHandler: (sessionId: string) => void;
};
const SessionsComponent: React.FC<SessionsComponentProps> = ({
                                                               sessions,
                                                               selectedSessions,
                                                               cinemaId = '121',
                                                               debug = true,
                                                               onClickHandler,
                                                             }) => {
  return (
    <div className="flex flex-row flex-wrap gap-y-4 py-2 px-2">
      {sessions
        .filter((session) => session.cinemaId === cinemaId)
        .map((session) => {
          const isPastDate = new Date(session.showtimeDate) < new Date();
          return (
            <Tooltip key={session.sessionId}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onClickHandler(session.sessionId)}
                  data-specialevent={session.isSpecialEvent}
                  data-selected={selectedSessions.includes(session.sessionId)}
                  data-ispastdate={isPastDate}
                  className={`relative
                  data-[selected=true]:border-[#ff9800]
                  data-[selected=true]:bg-[#ffecb3]
                  data-[selected=true]:border-l-black
                  data-[specialevent=true]:bg-[#fff59d]
                  data-[ispastdate=true]:cursor-not-allowed
                  data-[ispastdate=true]:opacity-50
                  data-[ispastdate=true]:past-date
                  hover:bg-[#d32f2f]
                  hover:data-[selected=false]:text-white
                  hover:data-[specialevent=true]:bg-[#d32f2f]
                  hover:scale-110 
                  flex flex-col items-center transition-colors duration-500 ease-in-out border-2 mx-2 min-w-[65px] bg-white rounded-md`}
                  disabled={isPastDate}
                >
                  <IntlDate date={new Date(session.showtimeDate)} timeZone="UTC"/>
                  <IntlTime date={new Date(session.showtimeDate)} timeZone="UTC"/>
                  {isPastDate && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <span className="text-red-600 text-5xl font-bold">X</span>
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.genreNames.join(', ')}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
    </div>
  );
};

export default SessionsComponent;