# Social cards

A social card is the 1200×630 image a link to the site shows when it's shared
in WhatsApp, Slack, LinkedIn or X. Every page names one in `og:image` and
`twitter:image`. The build draws them all, so a new item gets its card without
any extra step.

| Card                      | Used by                                    | Art                                |
| ------------------------- | ------------------------------------------ | ---------------------------------- |
| `/og/home.png`            | The home page and anything not listed here | `wave`, or `santa` in December     |
| `/og/library.png`         | The library, its listings and tag pages    | `thumbs-up`                        |
| `/og/projects.png`        | The projects page                          | `cheer`                            |
| `/og/about.png`           | The about page                             | The transparent portrait           |
| `/og/contact.png`         | The contact page                           | `beer`                             |
| `/og/not-found.png`       | The 404 page                               | `confused`                         |
| `/og/library/<slug>.png`  | Each item                                  | The item's featured image          |
| `/og/projects/<slug>.png` | Each project                               | The project's featured screenshot  |

The poses are in `src/assets/images/emojis/250/`. An item or project with no
featured image gets `wave`. The December swap happens at build time, so the
home card changes with the first deploy in December and the first one after.

## How they're made

`src/pages/og/[...card].png.js` lists the cards and what goes on them.
`src/lib/social-cards.js` draws them: satori lays each card out as SVG, and
sharp turns it into a palette PNG of about 100 KB. WhatsApp drops images much
over 300 KB, which `tests/e2e/social-cards.spec.js` checks.

Pages pass their card to `Layout` as `image={cardPath('about')}`, and `Layout`
falls back to the home card.

An item card shows the title in up to three lines and as much of the summary
as fits under it. The longer the title, the shorter the summary, and the
summary ends with an ellipsis when it's cut.

## Fonts

satori can't read woff2 or choose an optical size, so the cards use static
TrueType instances of the site's fonts, in `src/assets/fonts/` with their
licences: Source Serif 4 at the Display size for headings and the Subhead
size for text, and IBM Plex Mono. They came from the Google Fonts CSS API:

```text
https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@60,600
https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@36,400
https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400
```

Fetched without a browser user agent, each response links a `.ttf` with
every glyph rather than a woff2 subset.

## Checking a card

Build, then open the PNG from `dist/og/`. To see how a link unfurls once it's
deployed, paste it into
[opengraph.xyz](https://www.opengraph.xyz/) or LinkedIn's
[Post Inspector](https://www.linkedin.com/post-inspector/). WhatsApp caches a
link's preview, so it can show an old card for a while after a change.
