import { RemoteTrackPublication } from 'livekit-client';

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

export type Message = {
  sender: string;
  content: string;
};
