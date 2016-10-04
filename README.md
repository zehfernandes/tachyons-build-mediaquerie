# Tachyons Build Media Queries

Wrap function for [postcss-update-media-queries] to help CLI interfaces.

## Features

- Parse single file or a directory with multiple CSS files
- Extract the customMedia variable from file
- Replace Media queries rules in order
- Per default don't overwrite media queries already on file

## How Works

### Input

```css
// Declare your @custom-media and your rules
@custom-media --breakpoint-not-small screen and (min-width: 30em);

.underline { text-decoration: underline; }
.strike { text-decoration: line-through; }
```

### Output

```css
// The wrap will genarate this file
@custom-media --breakpoint-not-small screen and (min-width: 30em);
.underline { text-decoration: underline; }
.strike { text-decoration: line-through; }

@media (--breakpoint-not-small) {
 .underline-ns { text-decoration: underline; }
 .strike-ns { text-decoration: line-through; }
}
```

## Usage

```js
const generate = require('tachyons-build-mediaquerie')
const inputFile = 'src/' // Single file or a directory multiple files

generate(inputFile, {
  variables: 'src/variables.css', // To declare @custom-media in a external file
  overwrite: true // to overwrite and regenerate all media queries
})
```
