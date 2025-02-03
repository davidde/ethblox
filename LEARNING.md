# Notes while building / learning
## Deployment: Github Pages vs Vercel
> This site was initially deployed to Vercel, but my free tier was canceled because of too much traffic. So now I'm documenting how to **deploy to Github Pages with Github Actions**.

### 0. Is it possible to deploy a Nextjs project with `output: 'standalone'` in nextConfig to Github Pages?
**NO!!! GitHub pages is a static host and `standalone` is not a static export!**

There are 3 ways to deploy/host Next.js:
- Node.js Server
- Docker Image
- Static HTML Export

So `output: 'standalone'` requires one of the first 2 options, which support all Next.js features. As the name implies, a static export does not support Next.js features that require a server.

### 1. Configure the Next.js Build Process
By default, Next.js uses Node.js to run the application, which is incompatible with GitHub Pages. We need to enable static page generation in Next.js in order to deploy to Github Pages.

Update `next.config.mjs` with the following:
```mjs
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone export for Github Pages:
  output: 'export',
  // Map all static assets to the project URL davidde.github.io/ethblox,
  // instead of the base davidde.github.io domain, but only for production:
  basePath: isProd ? '/ethblox' : undefined,
  // Note that all `npm run build` commands will get classified as 'production',
  // so they will get the '/ethblox' basePath even when run locally.
  // This means that when running the build with `node .next/standalone/server.js` locally,
  // the base URL is `http://localhost:3000/ethblox/`, and the default
  // `http://localhost:3000/` will 404.
};

export default nextConfig;
```
> [!NOTE]
> When using `output: 'export'` Nextjs will throw the runtime Error `Page "/[network]/page" is missing exported function "generateStaticParams()", which is required with "output: export" config.` because of the use of the dynamic route `[network]`:
> - We could either switch to `output: 'standalone'`, but this is not compatible with Github Pages, meaning we should deploy to another hosting provider like [Deno Deploy](https://deno.com/deploy), [Render](https://render.com/), [Railway](https://railway.com/) or [Vercel](https://vercel.com/). See the [Nextjs Github](https://github.com/nextjs) for possible deploy templates.
> - Or we could try to implement `generateStaticParams()` to statically generate the dynamic routes at build time. But it's not clear to me how this will work for dynamic routes that aren't known at build time. The [Nextjs Docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params#all-paths-at-runtime) inform us that to statically render all paths the first time they're visited, we should just return an empty array, and no paths will be rendered at build time. Supposedly if we return nothing, the route will be rendered dynamically.

&nbsp;

> [!CAUTION]
> **The rest of these steps are for `output: 'standalone'`!!!**

### 2. Update `package.json` for `output: 'standalone'`
In `package.json`, update the `"start"` command of the `"scripts"` field:
```json
"scripts": {
  "dev": "next dev -p 3005",
  "build": "next build",
  "start": "node .next/standalone/server.js",
  "lint": "next lint"
},
```
Nextjs in `standalone` mode puts its build in `.next/standalone`, where the executable server is located.

### 3. Add the environment variables to Github
- On Github, navigate to the `Settings` tab of your project, and select `Environments` from the menu on the left-hand side.
- Select the`github-pages` environment, and under `Environment secrets`, click `Add environment secret` and add `REACT_APP_ALCHEMY_API_KEY` and its value.
- Click `Add environment secret` again and add `REACT_APP_ETHERSCAN_API_KEY` and its value.

### 4. Activate GitHub Pages for Repository
- Now, still under the `Settings` tab of your project, select `Pages` from the menu on the left-hand side.
- Locate the `Source` dropdown, which is likely set to `Deploy from a branch`.
- Click `Deploy from a branch` and switch it to `Github Actions`.
- Click `Configure` in the Github Actions field, which will take you to a `/.github/workflows/nextjs.yml` action configuration file.
- In this file, we need to add the API keys to the build step. Find the following text:
  ```yml
  - name: Build with Next.js
    run: ${{ steps.detect-package-manager.outputs.runner }} next build
  ```
  And add the following `env` section, followed by a section to copy the `public` and `static` folders:
  ```yml
  - name: Build with Next.js
    run: ${{ steps.detect-package-manager.outputs.runner }} next build
    env:
      REACT_APP_ALCHEMY_API_KEY: ${{ secrets.REACT_APP_ALCHEMY_API_KEY }}
      REACT_APP_ETHERSCAN_API_KEY: ${{ secrets.REACT_APP_ETHERSCAN_API_KEY }}
  - name: Copy public and static folders
    run: |
      cp -r public .next/standalone/
      cp -r .next/static .next/standalone/.next/
  ```
  Without the `cp` command, the build will not find any CSS files. Note that if you want to run an `npm run build` locally, you need to first manually copy these 2 folders, before starting the build with `node .next/standalone/server.js`.
- In the next section of that same file, update the `path` where the binaries are located; change `path: ./out` to `path: ./.next/standalone`:
  ```yml
  - name: Upload artifact
    uses: actions/upload-pages-artifact@v3
    with:
      path: .next/standalone
  ```
  Failing to do so will result in build errors because tar cannot find the proper directory to archive.
- Still in that file, also comment out the line that says `static_site_generator: next` under `- name: Setup Pages`. Additonally, you'll also need to comment out the `with:` header, because an empty field is invalid:
  ```yml
  - name: Setup Pages
    uses: actions/configure-pages@v5
    # IF YOU DO NOT UNCOMMENT THIS SECTION, IT WILL IGNORE THE `next.config.mjs` FILE:
    # with:
      # Automatically inject basePath in your Next.js configuration file and disable
      # server side image optimization (https://nextjs.org/docs/api-reference/next/image#unoptimized).
      #
      # You may remove this line if you want to manage the configuration yourself.
      # static_site_generator: next
  ```
  If you do not comment these out, the build process will ignore the local `next.config.mjs` file, and you will get build errors!
- Finally, click `Commit changes...` to commit it to the main branch. After committing, GitHub will automatically initiate the deployment to GitHub Pages. You can inspect this process in your project's `Actions` tab, which you can find in the middle of the `Code` and `Settings` tabs.

## Security
* After checking out [Key security Best practices](https://docs.alchemy.com/docs/best-practices-for-key-security-and-management) and [Using JWTs](https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests), it is not clear to me how one would go about updating the JWTs, since they are supposed to be short-lived. In the example, their expiration time is even 10 minutes! How to keep the service functioning if JWTs are expiring that fast?

## Alchemy SDK
* Is it possible to use other API providers than Alchemy itself, like it is with ethers.js? (E.g. Infura, Etherscan, Cloudfare, etc.)

## Next.js
* Persistent bug:
  ```
  Failed to generate cache key for https://eth-mainnet.g.alchemy.com/v2/[ALCHEMY_API_KEY]
  ```
  By grepping inside the `next` node_module, we find a dozen possible locations for this message:
  ```
  node_modules\next\dist\compiled\next-server\app-page-experimental.runtime.dev.js.map
  node_modules\next\dist\compiled\next-server\app-page-experimental.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-page-turbo-experimental.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-page-turbo.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-page.runtime.dev.js.map
  node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-route-experimental.runtime.dev.js
  node_modules\next\dist\compiled\next-server\app-route-experimental.runtime.dev.js.map
  node_modules\next\dist\compiled\next-server\app-route-experimental.runtime.prod.js
  node_modules\next\dist\compiled\next-server\app-route-experimental.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-route-turbo-experimental.runtime.prod.js
  node_modules\next\dist\compiled\next-server\app-route-turbo-experimental.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-route-turbo.runtime.prod.js
  node_modules\next\dist\compiled\next-server\app-route-turbo.runtime.prod.js.map
  node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js
  node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js.map
  node_modules\next\dist\compiled\next-server\app-route.runtime.prod.js
  node_modules\next\dist\compiled\next-server\app-route.runtime.prod.js.map
  node_modules\next\dist\esm\server\lib\patch-fetch.js
  node_modules\next\dist\server\lib\patch-fetch.js
  ```
  We can tell from these paths that the file we'll likely need is `patch-fetch.js`, since it's located directly in the server, without intervening `compiled` or `esm` (ECMAScript modules) folders. The location of the error looks like this:
  ```js
  const isCacheableRevalidate = typeof revalidate === "number" && revalidate > 0 || revalidate === false;
  let cacheKey;
  if (staticGenerationStore.incrementalCache && isCacheableRevalidate) {
      try {
          cacheKey = await staticGenerationStore.incrementalCache.fetchCacheKey(fetchUrl, isRequestInput ? input : init);
      } catch (err) {
          console.error(`Failed to generate cache key for`, input);
          // We put in an extra error log here, to verify this is the file:
          console.error(err);
      }
  }
  ```
  After restarting the dev server with `npm run dev`, we get the following error log:
  ```
  Failed to generate cache key for https://eth-mainnet.g.alchemy.com/v2/[ALCHEMY_API_KEY]
  TypeError: formData.getAll is not a function
      at IncrementalCache.fetchCacheKey (A:\Dev\blockchain\alchemy-ethereum-developer-bootcamp\week-3\blockexplorer_nextjs\node_modules\next\dist\server\lib\incremental-cache\index.js:233:45)
      at eval (webpack-internal:///(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js:386:77)
      at eval (webpack-internal:///(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js:134:36)
      at NoopContextManager.with (webpack-internal:///(rsc)/./node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
      at ContextAPI.with (webpack-internal:///(rsc)/./node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
      at NoopTracer.startActiveSpan (webpack-internal:///(rsc)/./node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
      at ProxyTracer.startActiveSpan (webpack-internal:///(rsc)/./node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854)
      at eval (webpack-internal:///(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js:116:103)
      at NoopContextManager.with (webpack-internal:///(rsc)/./node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
      at ContextAPI.with (webpack-internal:///(rsc)/./node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
      at NextTracerImpl.trace (webpack-internal:///(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js:116:28)
      at patched (webpack-internal:///(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js:233:41)
      at eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/geturl.js:53:32)
      at Generator.next (<anonymous>)
      at eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/geturl.js:13:71)
      at new Promise (<anonymous>)
      at __awaiter (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/geturl.js:9:12)
      at getUrl (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/geturl.js:18:12)
      at eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/index.js:194:85)
      at Generator.next (<anonymous>)
      at eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/index.js:21:71)
      at new Promise (<anonymous>)
      at __awaiter (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/index.js:17:12)
      at eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/index.js:190:16)
      at _fetchData (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/index.js:294:7)
      at Module.fetchJson (webpack-internal:///(rsc)/./node_modules/@ethersproject/web/lib.esm/index.js:336:12)
      at AlchemyProvider._send (webpack-internal:///(rsc)/./node_modules/alchemy-sdk/dist/cjs/alchemy-provider-8762fa7e.js:303:28)
      at AlchemyProvider.send (webpack-internal:///(rsc)/./node_modules/alchemy-sdk/dist/cjs/alchemy-provider-8762fa7e.js:267:21)
      at AlchemyProvider.eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js:588:35)
      at Generator.next (<anonymous>)
      at eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js:24:71)
      at new Promise (<anonymous>)
      at __awaiter (webpack-internal:///(rsc)/./node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js:20:12)
      at AlchemyProvider.perform (webpack-internal:///(rsc)/./node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js:565:16)
      at AlchemyProvider.eval (webpack-internal:///(rsc)/./node_modules/@ethersproject/providers/lib.esm/base-provider.js:1282:39)
      at Generator.next (<anonymous>)
      at fulfilled (webpack-internal:///(rsc)/./node_modules/@ethersproject/providers/lib.esm/base-provider.js:28:58)
      at runNextTicks (node:internal/process/task_queues:65:5)
      at listOnTimeout (node:internal/timers:555:9)
      at process.processTimers (node:internal/timers:529:7)
  ```
  which means we are at least in the right file!

  This bug seems to be caused by a cache for hot reloads in local development.

  From Next 15 onwards, you can disable this cache like this in `next.config.js`:
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    experimental: {
      serverComponentsHmrCache: false, // defaults to true
    },
  }
  
  module.exports = nextConfig
  ```
  See the [Nextjs serverComponentsHmrCache docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache) for more info.


## CSS
* Commit `ea4e75d93567fc1b4e2494c6d5a6b6254fe39dce` has a really difficult bug to track down: it has a spacing at the bottom, right above the footer that I couldn't get rid off. It is caused by the negative positioning of the flex container that makes the Stats component overlap with the NodeBanner (line 50 in `src/components/content/home-page/index.tsx`). Changing `top: -6rem;` to `margin-top: -6rem;` fixes this, or in Tailwind speak `-top-[6rem]` to `-mt-[6rem]`.



