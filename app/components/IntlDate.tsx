import { useLocales } from '~/providers/LocaleProvider';

type IntlDateProps = {
  date: Date;
  timeZone?: string;
};

export const IntlDate = ({ date, timeZone }: IntlDateProps) => {
  const locales = useLocales();
  const isoString = date.toISOString();
  const formattedDate = new Intl.DateTimeFormat(locales, {
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(date);

  return <time className="text-sm" dateTime={isoString}>{formattedDate}</time>;
};