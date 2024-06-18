import * as React from 'react';
import {Session} from '~/schemas/venue';
import {IntlDate} from '~/components/IntlDate';
import {IntlTime} from '~/components/IntlTime';

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
    <div className="flex flex-row py-2">
      {sessions
        .filter((session) => session.cinemaId === cinemaId)
        .map((session) => (
          <button
            key={session.sessionId}
            onClick={() => onClickHandler(session.sessionId)}
            data-specialevent={session.isSpecialEvent}
            data-selected={selectedSessions.includes(session.sessionId)}
            className="flex flex-col items-center
               transition-colors duration-500 ease-in-out
               border-2 mx-2 min-w-[65px]
               border-l-black
               data-[selected=true]:border-green-500
               data-[selected=true]:bg-green-200
               hover:bg-red-600
               hover:data-[selected=false]:text-white
               data-[specialevent=true]:bg-amber-200
               hover:data-[specialevent=true]:bg-red-600
               hover:scale-110
               rounded-md
               ">
            {debug && (<div className="">{session.sessionId}</div>)}

            <IntlDate date={new Date(session.showtimeDate)} timeZone="UTC"/>

            <IntlTime date={new Date(session.showtimeDate)} timeZone="UTC"/>
          </button>
        ))}
    </div>
  );
};

export default SessionsComponent;