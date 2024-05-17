# mjr.sh

[![GitHub Repo stars](https://img.shields.io/github/stars/manjaro-contrib/mjr.sh)](https://mjr.sh/A91B)

URL shortener for manjaro friends.

## Usage

### Adding a short URL

```sh
https://mjr.sh/add?url=https://example.com
```

Which returns something like this:

```json
{
  "url": "https://mjr.sh/AAC3",
  "secret": "FAB7D9A995385A422C96"
}
```

Store the secret if you'd like to edit the URL afterwards.

### Editing the URL

```sh
https://mjr.sh/edit/FAB7D9A995385A422C96?url=https://example.com
```

Which returns the same again.

## Notes

- references to `https://example.com` are being purged on a regular basis.
- all of this makes use of the generous free tiers of cloudflare workers and [d1](https://developers.cloudflare.com/d1/platform/pricing/), so 100k links can be added per day and they can be read 5 Mio times per day and take up virtually no space. We should be good for a long time:tm:.
- no information is being stored on who created the links.
