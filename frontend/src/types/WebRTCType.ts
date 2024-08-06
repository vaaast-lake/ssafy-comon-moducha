import { RemoteTrackPublication } from 'livekit-client';

export type trackKind = 'video' | 'audio';

export interface TrackInfo {
  participantIdentity: string;
  trackPublication: RemoteTrackPublication;
};

export type Message = {
  sender: string | undefined;
  content: string;
};

export interface GroupedTracks {
  [participantIdentity: string]: {
    [key in trackKind]?: TrackInfo;
  } | null;
};