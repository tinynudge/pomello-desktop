import { getThemeCss } from '@/helpers/getThemeCss';
import { ThemeCss } from '@pomello-desktop/domain';

export const handleGetThemeCss = async (): Promise<ThemeCss> => getThemeCss();
