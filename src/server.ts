// Taken from https://raw.githubusercontent.com/mcansh/remix-fastify/main/packages/remix-fastify/src/server.ts

import type * as http from "node:http";
import type * as http2 from "node:http2";
import type * as https from "node:https";
import { PassThrough } from "node:stream";
import type { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { createReadableStreamFromReadable, writeReadableStreamToWritable } from "./stream";

type HttpServer = http.Server | https.Server | http2.Http2Server | http2.Http2SecureServer;

function createRemixHeaders(requestHeaders: FastifyRequest["headers"]): Headers {
  const headers = new Headers();

  for (const [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

function getUrl<Server extends HttpServer>(request: FastifyRequest<RouteGenericInterface, Server>): string {
  const origin = `${request.protocol}://${request.hostname}`;
  const url = `${origin}${request.url}`;
  return url;
}

export function createStandardRequest<Server extends HttpServer>(
  request: FastifyRequest<RouteGenericInterface, Server>,
  reply: FastifyReply<Server>,
): Request {
  const url = getUrl(request);

  // Abort action/loaders once we can no longer write a response
  const controller = new AbortController();
  reply.raw.on("close", () => controller.abort());

  const init: RequestInit = {
    method: request.method,
    headers: createRemixHeaders(request.headers),
    signal: controller.signal,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = createReadableStreamFromReadable(request.raw);
    (init as { duplex: "half" }).duplex = "half";
  }

  return new Request(url, init);
}

export async function sendStandardResponse<Server extends HttpServer>(
  reply: FastifyReply<Server>,
  standardResponse: Response,
): Promise<void> {
  reply.status(standardResponse.status);

  for (const [key, values] of standardResponse.headers.entries()) {
    reply.headers({ [key]: values });
  }

  if (standardResponse.body) {
    const stream = new PassThrough();
    reply.send(stream);
    await writeReadableStreamToWritable(standardResponse.body, stream);
  } else {
    reply.send();
  }
  return reply;
}
