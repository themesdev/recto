// Remembering a dismissed announcement, framework-free: Announcement.astro's script imports only this module.

/** A short key from the text, so a new announcement shows again after an old one was dismissed. */
export const announcementKey = (text: string) => {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

/** The localStorage entry for a key. Reading and writing may throw (storage blocked): callers catch. */
export const dismissedKey = (key: string) => `sections:announcement:${key}`;
