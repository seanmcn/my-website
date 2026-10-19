# Featured images

Every post and note has a featured image: a square cartoon generated with
OpenAI. Two scripts make one for an item under `content/blog`. Both need
`OPENAI_API_KEY` set in a `.env` file at the repo root. `.env.example` lists
it.

```sh
npm run image
npm run image -- content/blog/2026/10/pi.md
npm run image:manual -- content/blog/2026/10/pi.md --prompt "..." --style chibi-cartoon --palette bright
```

With no item named, `npm run image` uses the newest one, drafts included.
It asks before replacing an image the item already has. A relative path
resolves against the directory you run the command from. In VS Code, the
`Generate Featured Image (Auto)` and `(Manual)` tasks run the same scripts on
the open file.

## `npm run image`

It asks nothing. It:

- has `gpt-5` read the item and write a one-sentence concept around one cute
  character. That's a person for items about people, otherwise the scene's
  main object brought to life with a face and limbs
- uses `chibi-cartoon` for a person and `mascot-cartoon` for an object
- alternates the palette (`balanced`, `bright`) against the most recently
  generated image, and avoids repeating recent concepts

To see the concept and full image prompt without generating anything, add
`--dry-run`.

## `npm run image:manual`

It takes the concept as `--prompt`, plus two options:

- `--style`, the illustration style: `basic-cartoon` (the default),
  `mascot-cartoon`, `chibi-cartoon` or `cozy-cartoon-scene`
- `--palette`: `pastel` (the default), `balanced` or `bright`

Its VS Code task asks for each.

## What both do

- generate a square image from the built-in cartoon editorial style prompt,
  varying palette emphasis, character treatment and finish
- save the PNG in the `images/` folder beside the item, e.g.
  `content/blog/2026/10/images/`
- fill in the item's `featured`, `featuredStyle`, `featuredPalette` and
  `featuredPrompt` frontmatter
