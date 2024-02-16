import type { FastifyReply, FastifyRequest } from "fastify";
import { createRequest } from "node-mocks-http";

import { createStandardRequest } from "../src";

describe("createStandardRequest", () => {
  it("creates a request with the correct headers", async () => {
    const fastifyRequest = createRequest({
      url: "/foo/bar",
      method: "GET",
      protocol: "http",
      hostname: "localhost:3000",
      headers: {
        "Cache-Control": "max-age=300, s-maxage=3600",
        Host: "localhost:3000",
      },
    }) as unknown as FastifyRequest;

    const fastifyReply = { raw: { on: jest.fn() } } as unknown as FastifyReply;

    const request = createStandardRequest(fastifyRequest, fastifyReply);

    expect(request.headers.get("cache-control")).toBe("max-age=300, s-maxage=3600");
    expect(request.headers.get("host")).toBe("localhost:3000");
  });
});
