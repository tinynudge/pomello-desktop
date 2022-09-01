import { AppProtocol } from '@domain';
import { ProtocolRequest, ProtocolResponse } from 'electron';

type ProtocolCallback = (response: ProtocolResponse) => void;

const handleAudioFileProtocol = (request: ProtocolRequest, callback: ProtocolCallback): void => {
  callback({
    path: request.url.replace(AppProtocol.Audio, ''),
  });
};

export default handleAudioFileProtocol;
