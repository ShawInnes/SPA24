import { useLocales } from '~/providers/LocaleProvider';

type IntlTimeProps = {
  date: Date;
  timeZone?: string;
};

export const IntlDay = ({ date, timeZone }: IntlTimeProps) => {
  const locales = useLocales();
  const isoString = date.toISOString();
  const formattedDate = new Intl.DateTimeFormat(locales, {
    weekday: 'short',
    timeZone,
  }).format(date);

  return <time className="text-sm" dateTime={isoString}>{formattedDate}</time>;
};