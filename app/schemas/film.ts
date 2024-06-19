import {z} from 'zod';

export const filmSchema = z.object({
  categoryName: z.string(),
  // categoryAccentColour: z.string(),
  // categoryCaption: z.string(),
  categoryParagraph: z.nullable(z.string()),
  // categoryImage: z.string(),
  // categorySecondImage: z.string(),
  movieId: z.string(),
  title: z.string(),
  englishTitle: z.string(),
  originalTitle: z.nullable(z.string()),
  slug: z.string(),
  heroImage: z.string(),
  // synopsis: z.string(),
  shortSynopsis: z.nullable(z.string()),
  trailerUrl: z.optional(z.string()),
  vimeoUrl: z.nullable(z.string()),
  // callOut: z.string(),
  // secondaryCallOut: z.string(),
});

export type Film = z.infer<typeof filmSchema>;

export const filmsSchema = z.object({
  pageProps: z.object({
    categories: z.array(z.string()),
    callouts: z.array(z.string()),
    movies: z.array(filmSchema),
  }),
});

export type Films = z.infer<typeof filmsSchema>;
