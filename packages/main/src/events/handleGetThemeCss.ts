import getThemeCss from '@/helpers/getThemeCss';
import { ThemeCss } from '@pomello-desktop/domain';

const handleGetThemeCss = async (): Promise<ThemeCss> => getThemeCss();

export default handleGetThemeCss;
