# Deployment

AWS Amplify builds and deploys the site from this repository. It uses the
default Amplify build image and the configuration in `amplify.yml`.

| Branch    | Environment                                          |
| --------- | ---------------------------------------------------- |
| `main`    | Production, [seanmcn.com](https://seanmcn.com)        |
| `develop` | Development, [develop.seanmcn.com](https://develop.seanmcn.com) |

## Keeping `develop` in step

`.github/workflows/sync-develop.yml` runs on every push to `main`, and can be
run by hand. It resets `develop` to `main`, so the next change starts from
what's released. If `develop` holds a commit that has no equivalent on `main`,
it leaves `develop` alone and lists those commits in the run summary. Rebase
duplicates of commits already on `main` don't count.

## Headers

Cache and security headers live in `customHttp.yml` and change on deploy.

## Redirects

Redirects can't be set from the repo. They live on the Amplify app (Hosting →
Rewrites and redirects), apply to every branch, and change as soon as they're
saved. They go in this order:

| Source                    | Target                | Type           | JSON `status` |
| ------------------------- | --------------------- | -------------- | ------------- |
| `/sw.js`                  | `/sw.js`              | 200 (Rewrite)  | `"200"`       |
| `https://www.seanmcn.com` | `https://seanmcn.com` | 301 (Redirect) | `"301"`       |
| `/feed/`                  | `/rss.xml`            | 301 (Redirect) | `"301"`       |
| `/<*>`                    | `/404.html`           | 404 (Rewrite)  | `"404-200"`   |

Amplify applies the first rule that matches. The `/sw.js` rule has to stay
above the `www` redirect. Browsers won't follow a redirect when they check a
service worker for updates, so without it the Gatsby service worker on `www`
would never be replaced.

The last rule must be 404 (Rewrite), `"404-200"` in the JSON editor. A plain
`"404"` is 404 (Redirect). That answers a missing page with a 302 to
`/404.html` instead of a 404 at the requested address. Check with
`curl -sI https://seanmcn.com/does-not-exist/`, which should return
`HTTP/2 404` and no `location` header.

The apex is the primary domain. Under Hosting → Custom domains, `www` has to
redirect to `seanmcn.com`, not the other way round, or it loops with the `www`
rule above. Pages are cached at the CDN until the next deploy, so a page
cached before a redirect change keeps its old response until then.

## Old addresses

Every address the site has used since its WordPress days is redirected by
`src/integrations/redirects.mjs`. That covers `/YYYY/MM/slug/`, `/blog/…`,
paged lists and merged categories. The integration writes a redirect page at
each old address. Anything else gets the 404 page, which suggests the closest
pages.

`public/sw.js` replaces the Gatsby site's offline service worker. Returning
visitors who still have that worker installed pick this one up, and it clears
its caches and unregisters itself. The `/sw.js` rule above keeps it reachable
on `www`.
