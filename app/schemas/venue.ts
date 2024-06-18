import {z} from 'zod';

export const sessionSchema = z.object({
  movieId: z.string(),
  slug: z.string(),
  title: z.string(),
  // englishTitle: z.string(),
  // originalTitle: z.string(),
  // rating: z.string(),
  genreNames: z.array(z.string()),
  runTime: z.string(),
  // heroImage: z.string(),
  scheduledFilmId: z.string(),
  showtimeDate: z.string(),
  sessionId: z.string(),
  // isPlatinum: z.boolean(),
  isSpecialEvent: z.boolean(),
  // displayAttributeText: z.string(),
  // displayAttributeColour: z.string(),
  cinemaId: z.string(),
  // localityName: z.string(),
  cinemaName: z.string(),
  // sessionUrl: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;

export const venuesSchema = z.object({
  pageProps: z.object({
    venue: z.object({
      sessions: z.array(sessionSchema),
    }),
  }),
});

export type Venues = z.infer<typeof venuesSchema>;
