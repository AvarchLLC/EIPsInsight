EIP-Board
=========

A tool to order [EIP] and [ERC] pull requests by oldest author interaction and
render a pretty HTML output.

## Usage

### Command Line

EIP-Board requires an [authentication token][auth]. A read-only public personal
access token is sufficient.

```bash
# Choose the repository to read from (usually ethereum/ERCs or ethereum/EIPs).
export GITHUB_REPOSITORY=ethereum/ERCs

# Replace the three dots with your access token.
export GITHUB_TOKEN=...

# Render the queue into a file.
cargo run > ./queue.html
```

### GitHub Action

EIP-Board can be used as a GitHub Action by adding the following to a file in
`.github/workflows/`:

```yaml
# ...
jobs:
  build:
    # ...
    steps:
      - name: EIP Board
        uses: gaudren/eip-board@master
        with:
          path: ./_site/eip-board.html
```

This snippet will generate a file at `./_site/eip-board.html`, which can then
be uploaded to GitHub Pages (or wherever else.)

[EIP]: https://github.com/ethereum/EIPs/
[ERC]: https://github.com/ethereum/ERCs/
[auth]: https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28
