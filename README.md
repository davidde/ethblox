<img src='src/app/favicon.ico' width=70 align='left'>

# ΞthBlox
## Ethereum Blockexplorer with Next.js, Typescript and TailwindCSS
This is the **Alchemy Ethereum Developer Bootcamp Week 3 project**, which I've been using to learn Next.js, and how its client/server components impact static site generation. Typescript and TailwindCSS were a first for me too, so overall it's been a very instructive experience.

The starter code and assignment are available [here](https://github.com/alchemyplatform/blockexplorer).  
I migrated it to [Next.js](https://nextjs.org/), bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Most prominent technologies used:
* [Alchemy SDK](https://docs.alchemy.com/)
* [React](https://react.dev/)
* [Next.js](https://nextjs.org/)'s "new" [App Router](https://nextjs.org/docs/app)
* [Typescript](https://www.typescriptlang.org/)
* [TailwindCSS](https://tailwindcss.com/)
* [Headless UI](https://headlessui.com/)

## Running the project locally
> [!IMPORTANT]
> To make the Alchemy API calls actually work, you will need an **Alchemy API key**, which you can get freely by creating an Alchemy account. Put the key into an `.env` file in the root of the project, without quotes:
> ```.env
> NEXT_PUBLIC_ALCHEMY_API_KEY=xyz
> ```
> The `NEXT_PUBLIC_` prefix is required to make it accessible to the browser.

* Clone this repo, and cd into it in your terminal:
  ```bash
  git clone https://github.com/davidde/ethblox; cd ethblox
  ```
* Install the project's packages:
  ```bash
  npm install
  ```
* Then start the development server:
  ```bash
  npm run dev
  ```
  This will start the Next.js development server on port 3005 (set in `package.json > scripts > dev`), so open http://localhost:3005 in the browser to see the result.

> [!WARNING]
> **The development server will not fully reflect the production state** of the application, since we're using `output: export` for full static site generation for Github Pages. The hot reload is still useful for quick iteration and feedback, but it is still necessary to frequently check the actual static site output with `serve out` after building with `npm run build` (install `serve` with `npm install -g serve`). It is also necessary to set the `LOCAL_BUILD` environment variable **before building**, otherwise the incorrect `basePath` will be applied in `nextConfig`, and all asset files (including CSS!) will **404**.
> 
> For example, in PowerShell:
> ```powershell
> $env:LOCAL_BUILD='true'; npm run build; serve out
> ```
> The `cross-env` version of the above command is specified for `npm run start`, so you can just use `npm run start` to start the production application, regardless of platform. Note that this obviously isn't "live", and will need to be repeated after code changes.

* Start the **"production" static site**:
  ```bash
  # Requires the `serve` package:
  # npm install -g serve
  npm run start
  ```
