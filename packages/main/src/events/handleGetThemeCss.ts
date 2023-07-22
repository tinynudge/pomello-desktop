import getThemeCss from '@/helpers/getThemeCss';
import { ThemeCss } from '@domain';

const handleGetThemeCss = async (): Promise<ThemeCss> => getThemeCss();

export default handleGetThemeCss;
