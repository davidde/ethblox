<img src='src/app/favicon.ico' width=70 align='left'>

# ΞthBlox
## Ethereum Blockexplorer with Next.js, Typescript and TailwindCSS
This is the Alchemy Ethereum Developer Bootcamp Week 3 project.  
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
> [!NOTE]
> To run this project locally, you will also need an Alchemy and Etherscan API key. You can get these freely by creating an Alchemy and Etherscan account. Put these keys into an `.env` file in the root of the project, without quotes:
> ```.env
> NEXT_PUBLIC_ALCHEMY_API_KEY=xyz
> NEXT_PUBLIC_ETHERSCAN_API_KEY=xyz
> ```

* Clone this repo, and cd into it in your terminal:
  ```bash
  git clone https://github.com/davidde/ethblox
  cd ethblox
  ```
* First, install the project's packages:
  ```bash
  npm install
  # or
  yarn install
  # or
  pnpm install
  # or
  bun install
  ```
* Then, start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  # or
  bun dev
  ```
  This will start the Next.js development server on port 3005 (set in `package.json > scripts > dev`), so open http://localhost:3005 in the browser to see the result.

> [!NOTE]
> **The development server will not fully reflect the production state** of the application, since we're using `output: export` for fully static site generation for Github Pages. The hot reload is still useful for quick iteration and feedback, but it is still necessary to frequently check the actual static site output with `serve out` (after `npm run build`). It is also necessary to set the `LOCAL_BUILD` environment variable **before building**, otherwise the incorrect `basePath` will be applied in `nextConfig`, and all asset files (including CSS!) will **404**.
> 
> For example, in PowerShell:
> ```powershell
>  $env:LOCAL_BUILD='true'; npm run build; serve out
> ```
> The `cross-env` version of the above is specified for `npm run start`, so you can just run `npm run start` to start the production application, regardless of platform. Note that this obviously isn't "live", and will need to be repeated after code changes.

&nbsp;

