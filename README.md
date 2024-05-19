# mjr.sh

[![GitHub Repo stars](https://img.shields.io/github/stars/manjaro-contrib/mjr.sh)](https://mjr.sh/C736)
[![Count Of Redirects](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmjr.sh%2Fstats&query=%24.redirects&label=redirects)](https://mjr.sh/stats)
[![Count Of Links](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmjr.sh%2Fstats&query=%24.links&label=links)](https://mjr.sh/stats)

URL shortener for manjaro friends.

## Try it out

### Adding a short URL

<form id="form" method="GET" action="https://mjr.sh/add">
  <input id="url" type="text" name="url" placeholder="https://example.com" pattern="https://.*" required>
  <input id="submit" type="submit" value="Generate">
</form>

<div id="result"></div>

```sh
curl -s https://mjr.sh/add?url=https://example.com
```

Which returns:

```json
{
  "url": "https://mjr.sh/C7D3",
  "edit": "https://mjr.sh/C7D3/edit?url=https%3A%2F%2Fexample.com&secret=4673cab7-6d01-479c-97b2-999010fa8987",
  "stats": "https://mjr.sh/C7D3/stats",
  "key": "C7D3",
  "timestamp": "2024-05-18 12:58:17",
  "value": "https://example.com",
  "secret": "4673cab7-6d01-479c-97b2-999010fa8987"
}
```

Store the secret if you'd like to edit the URL afterwards.

### Editing the URL

```sh
curl -s https://mjr.sh/C7D3/edit?secret=4673cab7-6d01-479c-97b2-999010fa8987&url=https%3A%2F%2Fexample.de
```

Which returns:

```json
{
  "url": "https://mjr.sh/C7D3",
  "key": "C7D3",
  "timestamp": "2024-05-18 12:59:30",
  "value": "https://example.de",
  "secret": "4673cab7-6d01-479c-97b2-999010fa8987"
}
```

### Public visitor count

```sh
curl -s https://mjr.sh/C7D3/stats
```

Which returns something like this

```json
{
  "key": "C7D3",
  "count": 1,
  "timestamp": "2024-05-17 19:34:01",
  "badge": "https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmjr.sh%2FAB34%2Fstats&query=%24.count&label=redirects"
}
```

## Notes

- Links are deleted after 14 days, except if their domains are on the [allowList](https://github.com/manjaro-contrib/mjr.sh/blob/main/functions/allowList.ts) - PRs welcome!
- If you'd like to add a url to the exclusion list, open an issue.
- If you'd like a little cli wrapper-script, check out [the one used in manjaro-sway](https://mjr.sh/11F8)
- All of this makes use of the generous free tiers of cloudflare workers and [d1](https://developers.cloudflare.com/d1/platform/pricing/), so 100k links can be added per day and they can be read 5 Mio times per day and take up virtually no space. We should be good for a long time :tm:
- No information is being stored on who created the links
- Stats are cached for 60 seconds
- If there's a reason to communicate on a direct channel (abuse), send an email to [info@mjr.sh](mailto:info@mjr.sh)

<details>
  <summary>Script</summary>
  
  <script async>
    var result = document.querySelector('#result')
    var searchParams = new URLSearchParams(document.location.search)
    var params = Object.fromEntries(searchParams);

    if (params["url"]) {
      var pre = document.querySelector(".language-sh").cloneNode(true)
      var copied = pre.querySelector(".copied")
      copied.setAttribute('data-code', params["url"])
      var content = pre.querySelector("code").querySelector("span")
      content.innerHTML = `url: <a href="${params["url"]}">${params["url"]}</a>\nedit: <a href="${params["edit"]}">${params["edit"]}</a>\nstats: <a href="${params["stats"]}">${params["stats"]}</a>`
      result.appendChild(pre);
    }
  </script>
</details>
