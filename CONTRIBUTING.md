# Contributing to the project

## Setting up your environment

1. **First, make sure you have the prerequisites installed:**
    * Node@>=14
    * Yarn@>=2
    * Java@>=8 ([wut](#why-java))

1. **Install dependencies for all packages:**
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

The first thing you'll want to do to run any of the apps locally is start up the Firebase emulators:
```bash
yarn start:emulators
```

To run the API:
```bash
yarn start:api
```

To run the Next.js site:
```bash
yarn start:web
```

To run the Storybook for the VTT:
```bash
yarn start:vtt:storybook
```

To build the VTT when changes occur:
```bash
yarn start:vtt
```

## FAQ

### Why Java?

I know, why in the butts would we need JAVA of all things to work on this Node/Next app? Well, Java is required for the Firebase emulators, which run locally. It's a pain, I know, but it means that we can work entirely offline. There's no more remote Firebase dependency for local development! 🥳
