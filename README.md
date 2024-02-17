# Fastify Standard Request/Reply

This library exports utilities that allow you to:

- Convert fastify's `request` into a Web API `Request`.
- Take a Web API `Response` and send its contents using fastify's `reply` object.

## Motivation

I was trying to run a Remix app from a Fastify server, but the existing [`remix-fastify`](https://github.com/mcansh/remix-fastify) library enforces a certain way of integrating these two. Luckily, most of the work that this library does is related to the conversion between the request/response APIs of Fastify and those of Remix (which uses Web API standard requests/responses). So I chose to extract that logic into its own library, so I had more freedom on how to use it.

If for some reason you need to convert between Fastify's request/responses and standard Web API request/responses you can use this library.

## How to install

```
npm install fastify-standard-request-reply
```

## How to use

If you want to convert a Fastify request/reply to a standard Web API request:

```typescript
import fastify from "fastify";
import { createStandardRequest } from "fastify-standard-request-reply";

const app = fastify();
app.all("*", async (request, reply) => {
  const request: Request = createStandardRequest(request, reply);
  // Do something with it ...
});
```

If you want to send a standard Web API response using Fastify's reply interface:

```typescript
import fastify from "fastify";
import { sendStandardResponse } from "fastify-standard-request-reply";

const app = fastify();
app.all("*", async (request, reply) => {
  const response = new Response();
  sendStandardResponse(reply, reponse);
});
```

## Thanks

Most of the code in this repository is taken from other places, so I would like to thank the following people/organizations for their work:

- Logan McAnsh ([mcansh](https://github.com/mcansh))
- The Remix team
