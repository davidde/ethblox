# Ethereum Blockexplorer with Next.js, Typescript and Tailwind CSS
This is the Alchemy Ethereum Developer Bootcamp Week 3 project.  
The starter code and assignment are available [here](https://github.com/alchemyplatform/blockexplorer).  
I migrated it to [Next.js](https://nextjs.org/), bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Most prominent technologies used:
* [Alchemy SDK](https://docs.alchemy.com/)
* [React](https://react.dev/)
* [Next.js](https://nextjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Headless UI](https://headlessui.com/)

## Running the project locally
> [!NOTE]
> To run this project locally, you will also need an Alchemy and Etherscan API key. You can get these freely by creating an Alchemy and Etherscan account. Put these keys into an `.env` file in the root of the project, without quotes:
> ```.env
> REACT_APP_ALCHEMY_API_KEY=xyz
> REACT_APP_ETHERSCAN_API_KEY=xyz
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

