// tslint:disable:max-line-length no-any

export type Paging<T> = {
  href: string, // A link to the Web API endpoint returning the full result of the request.
  items: T[], // The requested data.
  limit: number, // The maximum number of items in the response (as set in the query or by default).
  next: string, // URL to the next page of items. (null if none)
  offset: number, // The offset of the items returned (as set in the query or by default).
  previous: string, // URL to the previous page of items. (null if none)
  total: number, // The total number of items available to return.
};

export type Image = {
  height: number, // The image height in pixels. If unknown: null or not returned.
  url: string, // The source URL of the image.
  width: number, // The image width in pixels. If unknown: null or not returned.
};

export type User = {
  display_name: string, // The name displayed on the user's profile. null if not available.
  external_urls: any, // Known public external URLs for this user.
  followers: any, // Information about the followers of this user.
  href: string, // A link to the Web API endpoint for this user.
  id: string, // The Spotify user ID for this user.
  images: Image[], // The user's profile image.
  type: 'user', // The object type: "user"
  uri: string, // The Spotify URI for this user.
};

export interface SimplePlaylist {
  collaborative: boolean; // true if the owner allows other users to modify the playlist.
  external_urls: any; // Known external URLs for this playlist.
  href: string; // A link to the Web API endpoint providing full details of the playlist.
  id: string; // The Spotify ID for the playlist.
  images: Image[]; // Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order. See Working with Playlists.Note: If returned, the source URL for the image (url) is temporary and will expire in less than a day.
  name: string; // The name of the playlist.
  owner: User; // The user who owns the playlist
  public: boolean | null; // The playlist's public/private status: true the playlist is public, false the playlist is private, null the playlist status is not relevant. For more about public/private status, see Working with Playlists.
  snapshot_id: string; // The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version
  tracks: { href: string, total: number }; // A collection containing a link (href) to the Web API endpoint where full details of the playlist's tracks can be retrieved, along with the total number of tracks in the playlist.
  type: string; // The object type: "playlist"
  uri: string; // The Spotify URI for the playlist.
}

export type SimpleArtist = {
  external_urls: any, // Known external URLs for this artist.
  href: string, // A link to the Web API endpoint providing full details of the artist.
  id: string, // The Spotify ID for the artist.
  name: string, // The name of the artist
  type: string, // The object type: "artist"
  uri: string, // The Spotify URI for the artist.
};

export type SimpleAlbum = {
  album_type: string, // The type of the album: one of "album", "single", or "compilation".
  artists: SimpleArtist[], // The artists of the album. Each artist object includes a link in href to more detailed information about the artist.
  available_markets: string[], // The markets in which the album is available: ISO 3166-1 alpha-2 country codes. Note that an album is considered available in a market when at least 1 of its tracks is available in that market.
  external_urls: any, // Known external URLs for this album.
  href: string, // A link to the Web API endpoint providing full details of the album.
  id: string, // The Spotify ID for the album.
  images: Image[], // The cover art for the album in various sizes, widest first.
  name: string, // The name of the album. In case of an album takedown, the value may be an empty string.
  type: string, // The object type: "album"
  uri: string, // The Spotify URI for the album.
};

export type Track = {
  album: SimpleAlbum, // The album on which the track appears. The album object includes a link in href to full information about the album.
  artists: SimpleArtist[], // The artists who performed the track. Each artist object includes a link in href to more detailed information about the artist.
  available_markets: string[], // A list of the countries in which the track can be played, identified by their ISO 3166-1 alpha-2 code.
  disc_number: number, // The disc number (usually 1 unless the album consists of more than one disc).
  duration_ms: number, // The track length in milliseconds.
  explicit: boolean, // Whether or not the track has explicit lyrics (true = yes it does; false = no it does not OR unknown).
  external_ids: any, // Known external IDs for the track.
  external_urls: any, // Known external URLs for this track.
  href: string, // A link to the Web API endpoint providing full details of the track.
  id: string, // The Spotify ID for the track.
  is_playable: boolean, // Part of the response when Track Relinking is applied. If true, the track is playable in the given market. Otherwise false.
  linked_from: any, // Part of the response when Track Relinking is applied, and the requested track has been replaced with different track. The track in the linked_from object contains information about the originally requested track.
  name: string, // The name of the track.
  popularity: number, // The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. Note that the popularity value may lag actual popularity by a few days: the value is not updated in real time.
  preview_url: string, // A link to a 30 second preview (MP3 format) of the track.
  track_number: number, // The number of the track. If an album has several discs, the track number is the number on the specified disc.
  type: string, // The object type: "track".
  uri: string, // The Spotify URI for the track.
};

export type PlaylistTrack = {
  added_at: string, // The date and time the track was added.Note that some very old playlists may return null in this field.
  added_by: User, // The Spotify user who added the track.Note that some very old playlists may return null in this field.
  is_local: boolean, // Whether this track is a local file or not.
  track: Track, // Information about the track.
};

export interface ApiError {
  error: {
    status: number;
    message: string;
  };
}

export interface AddTracksSuccess {
  snapshot_id: string;
}

export type AddTracksRes = AddTracksSuccess | ApiError;
