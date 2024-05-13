# manjaro-download

URL shortener for manjaro friends.

## Usage

### Adding a short URL

```sh
https://manjaro.download/add?url=https://example.com
```

Which returns something like this:

```json
{
  "url": "https://manjaro.download/AAC3",
  "secret": "FAB7D9A995385A422C96"
}
```

Store the secret if you'd like to edit the URL afterwards.

### Editing the URL

```sh
https://manjaro.download/edit/FAB7D9A995385A422C96?url=https://example.com
```

Which returns the same again.

## Notes

- references to `https://example.com` are being purged on a regular basis.
- all of this makes use of the generous free tiers of cloudflare workers and [d1](https://developers.cloudflare.com/d1/platform/pricing/), so 100k links can be added per day and they can be read 5 Mio times per day and take up virtually no space. We should be good for a long time:tm:.
