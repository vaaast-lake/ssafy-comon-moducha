import { RemoteTrackPublication } from 'livekit-client';

export type SourceKind = 'camera' | 'microphone' | 'screen_share';

export interface TrackInfo {
  participantIdentity: string;
  participantName?: string;
  trackPublication: RemoteTrackPublication;
  isMute: boolean;
};

export type Message = {
  sender: string | undefined;
  content: string;
};

export interface GroupedTracks {
  [participantIdentity: string]: {
    [key in SourceKind]?: TrackInfo;
  };
};