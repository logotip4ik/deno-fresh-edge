import { Head } from "$fresh/runtime.ts";
import { ofetch } from "ofetch";

import { Handlers, PageProps } from "$fresh/server.ts";

interface IPGeoResponse {
  status: "success" | "fail";
}

interface IPGeoResponseSuccess extends IPGeoResponse {
  country: string;
  city: string;
  zip: string;
  timezone: string;
}

interface IPGeoResponseFail extends IPGeoResponse {
  message: string;
}

type RequestInfo = IPGeoResponseSuccess | IPGeoResponseFail;

export const handler: Handlers<RequestInfo> = {
  async GET(_req, ctx) {
    const { hostname } = ctx.remoteAddr as Deno.NetAddr;

    const ipInfo = await ofetch<RequestInfo>(
      `http://ip-api.com/json/${hostname}`,
    );

    return ctx.render(ipInfo);
  },
};

const seoHead = (
  <>
    <Head>
      <link rel="stylesheet" href="/styles/global.css" />
      <title>Fresh App</title>
    </Head>
  </>
);

export default function Home({ data }: PageProps<RequestInfo>) {
  return (
    <>
      {seoHead}

      <main>
        <h1>Rendered at edge: {new Date().toISOString()}</h1>

        {data.status === "fail"
          ? <p>Sorry, but could not find your location</p>
          : (
            <ul>
              <li>country: {(data as IPGeoResponseSuccess).country}</li>
              <li>city: {(data as IPGeoResponseSuccess).city}</li>
              <li>zip: {(data as IPGeoResponseSuccess).zip}</li>
              <li>timezone: {(data as IPGeoResponseSuccess).timezone}</li>
            </ul>
          )}
      </main>
    </>
  );
}
