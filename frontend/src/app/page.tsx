import { cmsRoute } from '../components/cms-route';

// The page document with slug "home" in the Studio. Rebuilt in the background at most once a minute (lib/data).
export const revalidate = 60;

const route = cmsRoute('home', '/');
export const generateMetadata = route.generateMetadata;
export default route.Page;
