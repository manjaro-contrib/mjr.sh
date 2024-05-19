/**
 * List of domains that are _not_ purged after the cutOff date.
 */
const allowList = [
  "github.com",
  "gitlab.com",
  "google.com",
  "google.de",
  "heise.de",
  "manjaro.org",
  "manjaro.download",
  "manjaro-sway.download",
  "githubusercontent.com",
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
