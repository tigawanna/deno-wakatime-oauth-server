import "jsr:@std/dotenv/load";
import { Hono } from "hono";
import { HomeRoute } from "./routes/home/index.tsx";

const app = new Hono({});

const my_app = Deno.env.get("MY_APP");
const client_id = Deno.env.get("CLIENT_ID");
const client_secret = Deno.env.get("CLIENT_SECRET");
const temp_access_token = Deno.env.get("TEMP_ACCESS_TOKEN");

if (!my_app) {
  throw new Error("MY_APP is not set");
}
if (!client_id) {
  throw new Error("CLIENT_ID is not set");
}
if (!client_secret) {
  throw new Error("CLIENT_SECRET is not set");
}

// home route
app.route("/", HomeRoute);
// get oauth token

app.post("/oauth/token", async (c) => {
//   https://wakatime.com/oauth/token - Make a server-side POST request here to get the secret access token. Required data is client_id, client_secret, redirect_uri must be the same url used in authorize step, grant_type of authorization_code, and the code received from the authorize step.
  const wakatime_oauth_endoint = "https://wakatime.com/oauth/token ";
  const redirect_uri = `${my_app}/redirect`;

  const wakatimeAuthUrl = new URL(wakatime_oauth_endoint);
  wakatimeAuthUrl.searchParams.append("client_id", client_id);
  wakatimeAuthUrl.searchParams.append("client_secret", client_secret);
  wakatimeAuthUrl.searchParams.append("redirect_uri", redirect_uri);
  try {
    const resopnse = await fetch(wakatimeAuthUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "grant_type": "authorization_code",
        "code": "code",
      }),
    }).then((r) => {
      if (!r.ok) {
        return c.json({
          status: r.status,
          statusText: r.statusText,
        });
      }
      console.log(" ==== resopnse  ==== ", r);
      return r;
    });
    return c.json({
      status: 200,
      resopnse,
    });
  } catch (error: unknown) {
    if(error instanceof Error) {
    console.log(" ==== error . message  ==== ", error.message);
    return c.json({
      status: 500,
      error: error.message,
    });
  }
  return c.json({
    status: 500,
    error: "Unknown error",
  });
  }

  // return c.redirect(wakatimeAuthUrl.toString())
});
app.post("/oauth/authorize", (c) => {
  // https://wakatime.com/oauth/authorize -
  // Redirect your users here to request permission to access their account.
  // Required url arguments are client_id, response_type of code or token, redirect_
  // uri. Optional parameters are scope, state, force_approve.
  const wakatime_oauth_endoint = "https://wakatime.com/oauth/authorize ";

  const response_type = "token";
  const redirect_uri = `${my_app}/redirect`;
  const scope = "read_stats,read_summaries";
  const state = "STATE";
  const force_approve = "false";

  const wakatimeAuthUrl = new URL(wakatime_oauth_endoint);
  wakatimeAuthUrl.searchParams.append("client_id", client_id);
  wakatimeAuthUrl.searchParams.append("response_type", response_type);
  wakatimeAuthUrl.searchParams.append("redirect_uri", redirect_uri);
  wakatimeAuthUrl.searchParams.append("scope", scope);
  wakatimeAuthUrl.searchParams.append("state", state);
  wakatimeAuthUrl.searchParams.append("force_approve", force_approve);
  return c.redirect(wakatimeAuthUrl.toString());
});

app.get("/redirect", async (c) => {
  
  const responseUrl = c.req.url;
  const responseBody = await c.req.parseBody();

  const code = c.req.param("code");
  const access_token = c.req.param("access_token");
  const expires_at = c.req.param("expires_at");
  const expires_in = c.req.param("expires_in");
  const refresh_token = c.req.param("refresh_token");
  const token_type = c.req.param("token_type");
  const scope = c.req.param("scope");
  const uid = c.req.param("uid");
  const state = c.req.param("state");

console.log(" ==== request context  ==== ");
console.dir(c.req, { depth: 30 });

console.log(" ==== request params  ==== ");
console.log({
    code,
    access_token,
    expires_at,
    expires_in,
    refresh_token,
    token_type,
    scope,
    uid,
    state,
  })



  return c.json({
    responseUrl,
    responseBody,
  });
});


app.get("/summaries", async (c) => {
  try {
    const summariesEndpoint = new URL("https://wakatime.com/api/v1/users/current/summaries");
    if (temp_access_token) {
      // summariesEndpoint.searchParams.append("access_token", temp_access_token);
    }
    summariesEndpoint.searchParams.append("start", "11/01/2024");
    summariesEndpoint.searchParams.append("end", "11/02/2024");
    const response = await fetch(summariesEndpoint.toString(), {
      headers: {
        "Authorization": "Bearer " + temp_access_token
      }
    })
      .then((r) => {
        if (!r.ok) {
          return c.json({
            status: r.status,
            statusText: r.statusText
          })
        }
        return r.json()
      })
    return c.json({
      status: 200,
      response
    })
  }
  catch (error: any) {
    console.log(" ==== error . message  ==== ", error.message);
    return c.json({
      status: 500,
      error: error.message,
    });
  }
});

app.get("/red", async (c) => {
const params = c.req.raw.url
return c.json({
  status: 200,
  params,
  request:c.req
});
})

// access_token = waka_tok_jzfbdhOWu8YVkLmGN8Jn9tButM6Gn5NZEjuHAnNqHDNdPJRY6JyquKxIX4dj03FVrWOEomqyZmqCq22P & start=11 /01 / 2024 & end=11 /02 / 2024
app.get("/current", async (c) => {
  try {
    const response = await fetch("https://wakatime.com/api/v1/users/current", {
      headers: {
        "Authorization": "Bearer waka_tok_jzfbdhOWu8YVkLmGN8Jn9tButM6Gn5NZEjuHAnNqHDNdPJRY6JyquKxIX4dj03FVrWOEomqyZmqCq22P"
      }
    })
      .then((r) => {
        if (!r.ok) {
          return c.json({
            status: r.status,
            statusText: r.statusText
          })
        }
        return r.json()
      })
    return c.json({
      status: 200,
      response
    })
  }
  catch (error: any) {
    console.log(" ==== error . message  ==== ", error.message);
    return c.json({
      status: 500,
      error: error.message,
    });
  }
});

Deno.serve({ port: 5000 }, app.fetch);


