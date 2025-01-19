# Notes while building / learning
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

## CSS
* Commit `ea4e75d93567fc1b4e2494c6d5a6b6254fe39dce` has a really difficult bug to track down: it has a spacing at the bottom, right above the footer that I couldn't get rid off. It is caused by the negative positioning of the flex container that makes the Stats component overlap with the NodeBanner (line 50 in `src/components/content/home-page/index.tsx`). Changing `top: -6rem;` to `margin-top: -6rem;` fixes this, or in Tailwind speak `-top-[6rem]` to `-mt-[6rem]`.