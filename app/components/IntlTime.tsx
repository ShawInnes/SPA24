import { useLocales } from '~/providers/LocaleProvider';

type IntlTimeProps = {
  date: Date;
  timeZone?: string;
};

export const IntlTime = ({ date, timeZone }: IntlTimeProps) => {
  const locales = useLocales();
  const isoString = date.toISOString();
  const formattedDate = new Intl.DateTimeFormat(locales, {
    hour: 'numeric',
    minute: 'numeric',
    timeZone,
  }).format(date);

  return <time className="text-sm" dateTime={isoString}>{formattedDate}</time>;
};