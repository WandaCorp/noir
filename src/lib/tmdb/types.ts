export type MediaType = "movie" | "tv";

export type Genre = {
  id: number;
  name: string;
};

export type MediaSummary = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: MediaType | "person";
  popularity: number;
  adult?: boolean;
  original_language?: string;
};

export type Paginated<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
};

export type Company = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

export type Country = {
  iso_3166_1: string;
  name: string;
};

export type Language = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type Season = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
};

export type Network = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export type WatchLocale = {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
};

export type Review = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
};

export type CollectionRef = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type MovieDetails = MediaSummary & {
  tagline: string;
  runtime: number | null;
  status: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string | null;
  genres: Genre[];
  spoken_languages: Language[];
  production_companies: Company[];
  production_countries: Country[];
  belongs_to_collection: CollectionRef | null;
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: Video[] };
  similar?: Paginated<MediaSummary>;
  recommendations?: Paginated<MediaSummary>;
  reviews?: Paginated<Review>;
  "watch/providers"?: { results: Record<string, WatchLocale> };
};

export type TvDetails = MediaSummary & {
  tagline: string;
  status: string;
  homepage: string;
  genres: Genre[];
  spoken_languages: Language[];
  production_companies: Company[];
  production_countries: Country[];
  created_by: { id: number; name: string; profile_path: string | null }[];
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  in_production: boolean;
  type: string;
  networks: Network[];
  seasons: Season[];
  last_air_date: string | null;
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: Video[] };
  similar?: Paginated<MediaSummary>;
  recommendations?: Paginated<MediaSummary>;
  reviews?: Paginated<Review>;
  "watch/providers"?: { results: Record<string, WatchLocale> };
};

export type HomeFeed = {
  trending: MediaSummary[];
  popularMovies: MediaSummary[];
  topMovies: MediaSummary[];
  nowPlaying: MediaSummary[];
  upcoming: MediaSummary[];
  popularTv: MediaSummary[];
  topTv: MediaSummary[];
  onAir: MediaSummary[];
  movieGenres: Genre[];
  tvGenres: Genre[];
};

// ============ PERSON TYPES ============

export type PersonCast = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: MediaType;
  character?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
};

export type PersonCrew = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: MediaType;
  job?: string;
  department?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
};

export type PersonImage = {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  vote_average: number;
  vote_count: number;
};

export type PersonDetails = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  gender: number;
  homepage: string | null;
  also_known_as: string[];
  imdb_id: string | null;
  popularity: number;
  combined_credits: {
    cast: PersonCast[];
    crew: PersonCrew[];
  };
  images: {
    profiles: PersonImage[];
  };
};

export type PersonSearchResult = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: MediaSummary[];
  popularity: number;
};

// ============ COLLECTION TYPES ============

export type CollectionPart = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
};

export type CollectionSummary = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type CollectionDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: CollectionPart[];
};

// ============ SEASON TYPES ============

export type Episode = {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date: string | null;
  vote_average: number;
  runtime: number | null;
};

export type SeasonDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
};