import { RemoteTrackPublication } from 'livekit-client';

export type TrackKind = 'video' | 'audio';

export interface TrackInfo {
  participantIdentity: string;
  trackPublication: RemoteTrackPublication;
  isMute: boolean;
};

export type Message = {
  sender: string | undefined;
  content: string;
};

export interface GroupedTracks {
  [participantIdentity: string]: {
    [key in TrackKind]?: TrackInfo;
  };
};