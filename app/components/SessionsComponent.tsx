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
    <div className="flex flex-row py-2 px-2">
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
               bg-white
               border-l-black
               data-[selected=true]:border-[#ff9800]
               data-[selected=true]:bg-[#ffecb3]
               hover:bg-[#d32f2f]
               hover:data-[selected=false]:text-white
               data-[specialevent=true]:bg-[#fff59d]
               hover:data-[specialevent=true]:bg-[#d32f2f]
               hover:scale-110
               rounded-md">

            <IntlDate date={new Date(session.showtimeDate)} timeZone="UTC"/>

            <IntlTime date={new Date(session.showtimeDate)} timeZone="UTC"/>
          </button>
        ))}
    </div>
  );
};

export default SessionsComponent;