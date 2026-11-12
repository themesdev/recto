import { cmsRoute } from '../../components/cms-route';

// The page document with slug "about" in the Studio. Rebuilt in the background at most once a minute (lib/data).
export const revalidate = 60;

const route = cmsRoute('about', '/about/');
export const generateMetadata = route.generateMetadata;
export default route.Page;
