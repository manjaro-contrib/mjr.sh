# mjr.sh

[![GitHub Repo stars](https://img.shields.io/github/stars/manjaro-contrib/mjr.sh)](https://mjr.sh/C736)
[![Count Of Redirects](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmjr.sh%2FC736%2Fstats&query=%24.count&label=redirects)](https://mjr.sh/C736)

URL shortener for manjaro friends.

## Usage

### Adding a short URL

```sh
curl -s https://mjr.sh/add?url=https://example.com
```

Which returns:

```json
{
  "url": "https://mjr.sh/AB34",
  "edit": "https://mjr.sh/edit/71B69B10C4C0B8ECFC11?url=https%3A%2F%2Fexample.com",
  "stats": "https://mjr.sh/AB34/stats",
  "key": "AB34",
  "secret": "71B69B10C4C0B8ECFC11",
  "timestamp": "2024-05-17 19:33:12",
  "value": "https://example.com"
}
```

Store the secret if you'd like to edit the URL afterwards.

### Editing the URL

```sh
curl -s https://mjr.sh/edit/71B69B10C4C0B8ECFC11?url=https://example.com
```

Which returns:

```json
{
  "url": "https://mjr.sh/AB34",
  "key": "AB34",
  "secret": "71B69B10C4C0B8ECFC11",
  "timestamp": "2024-05-17 19:34:01",
  "value": "https://example.com"
}
```

### Public visitor count

```sh
curl -s https://mjr.sh/AAC3/stats
```

Which returns something like this

```json
{
  "key": "AB34",
  "count": 1,
  "timestamp": "2024-05-17 19:34:01",
  "badge": "https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmjr.sh%2FAB34%2Fstats&query=%24.count&label=redirects"
}
```

## Notes

- references to `https://example.com` are being purged on a regular basis
- all of this makes use of the generous free tiers of cloudflare workers and [d1](https://developers.cloudflare.com/d1/platform/pricing/), so 100k links can be added per day and they can be read 5 Mio times per day and take up virtually no space. We should be good for a long time:tm:
- no information is being stored on who created the links
- stats are cached for 60 seconds
