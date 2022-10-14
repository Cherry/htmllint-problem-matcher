# Problem Matcher for htmllint

[![CI Workflow Status](https://github.com/Cherry/htmllint-problem-matcher/workflows/CI/badge.svg)](https://github.com/Cherry/htmllint-problem-matcher/actions?query=workflow%3ACI)

Adds a problem matcher that will detect errors from [htmllint](https://github.com/htmllint/htmllint) and create annotations for them.

## Usage

```yml
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
          with:
            node-version: "16.x"
      - uses: Cherry/htmllint-problem-matcher@v1
      - run: npm ci
      - run: npm test
```
## Options

Name | Allowed values | Description
-- | -- | --
`action` | `add` (default), `remove` | If the problem matcher should be registered or removed
