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