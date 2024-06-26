import { AppProtocol } from '@pomello-desktop/domain';
import { net } from 'electron';
import { pathToFileURL } from 'url';

export const handleAudioFileProtocol = (request: Request): Promise<Response> =>
  net.fetch(pathToFileURL(request.url.replace(AppProtocol.Audio, '')).toString());
