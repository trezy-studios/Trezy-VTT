# Contributing to the project

## Setting up your environment

1. First, make sure you have the prerequisites installed:
    * Node@>=14
    * Yarn@latest

1. Install dependencies for all packages:
    ```bash
    yarn install
    ```

### Web ENV Variables

If you are working on the website you should already be a member of the Vercel team (if not, poke [Trezy](https://github.com/trezy)). Make sure to login to Vercel via the CLI, link the project, then pull the development ENV variables:

```bash
yarn vercel:login
yarn vercel:link # trezy-vtt
yarn vercel:env:pull
```

### API ENV Variables

If you need the ENV variables for the API, just poke Trezy.

## Running the packages

To run the Next.js site:
```bash
yarn start:web
```

To run the API:
```bash
yarn start:api
```
