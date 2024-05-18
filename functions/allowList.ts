/**
 * List of domains that are _not_ purged after the cutOff date.
 */
const allowList = [
  "books.google.de",
  "files.manjaro.org",
  "forum.manjaro.org",
  "github.com",
  "gitlab.com",
  "gitlab.manjaro.org",
  "google.com",
  "heise.de",
  "manjaro.org",
  "manjaro.download",
  "manjaro-sway.download",
  "packages.manjaro.org",
  "raw.githubusercontent.com",
  "wiki.manjaro.org",
  "youtube.com",
];

const cutOffDays = 14;
export const getCutoffDate = () => {
  const cutOff = new Date(
    Date.now() - 1000 * 60 * 60 * 24 * cutOffDays
  ).toISOString();

  return cutOff;
}

export default allowList;
