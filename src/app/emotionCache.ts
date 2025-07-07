import createCache from '@emotion/cache';

// Client-side cache, shared for the whole session of the user in the browser.
const emotionCache = createCache({ key: 'css', prepend: true });

export default emotionCache;
