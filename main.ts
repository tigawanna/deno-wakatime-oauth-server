import { Hono } from 'hono'

const app = new Hono({})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.post('/oauth/token', async(c) => {
  console.log(" ==== c.req.url  ==== ",c.req.url)
//   https://wakatime.com/oauth/token - Make a server-side POST request here to get the secret access token. Required data is client_id, client_secret, redirect_uri must be the same url used in authorize step, grant_type of authorization_code, and the code received from the authorize step.
  
const wakatime_oauth_endoint = "https://wakatime.com/oauth/token "
  
  const redirect_uri = `${my_app}/redirect`


  const wakatimeAuthUrl = new URL(wakatime_oauth_endoint)
  wakatimeAuthUrl.searchParams.append('client_id', client_id)
  wakatimeAuthUrl.searchParams.append('client_secret', client_secret)
  wakatimeAuthUrl.searchParams.append('redirect_uri', redirect_uri)
  try {
  const resopnse =  await fetch(wakatimeAuthUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'grant_type': 'authorization_code',
        'code': 'code'
      })
    }).then((r)=>{
      if(!r.ok){
        console.log(" ==== resopnse  ==== ",r)
        return c.json({
          status: r.status,
          statusText: r.statusText,
        })
      }
      console.log(" ==== resopnse  ==== ",r)
      return r
    })
    return c.json({
      status: 200,
      resopnse
    })
  } catch (error:any) {
    console.log(" ==== error . message  ==== ",error.message)
    return c.json({
      status: 500,
      error: error.message
    })
  }


  // return c.redirect(wakatimeAuthUrl.toString())
})
app.post('/oauth/authorize', (c) => {
  // https://wakatime.com/oauth/authorize - 
  // Redirect your users here to request permission to access their account. 
  // Required url arguments are client_id, response_type of code or token, redirect_
  // uri. Optional parameters are scope, state, force_approve.
  const wakatime_oauth_endoint = "https://wakatime.com/oauth/authorize "
  
  const response_type = "token"
  const redirect_uri = `${my_app}/redirect`
  const scope = "read_stats,read_summaries"
  const state = "STATE"
  const force_approve = "false"

  const wakatimeAuthUrl = new URL(wakatime_oauth_endoint)
  wakatimeAuthUrl.searchParams.append('client_id', client_id)
  wakatimeAuthUrl.searchParams.append('response_type', response_type)
  wakatimeAuthUrl.searchParams.append('redirect_uri', redirect_uri)
  wakatimeAuthUrl.searchParams.append('scope', scope)
  wakatimeAuthUrl.searchParams.append('state', state)
  wakatimeAuthUrl.searchParams.append('force_approve', force_approve)
  console.log("wakatime url  == ", wakatimeAuthUrl.toString())
  return c.redirect(wakatimeAuthUrl.toString())
})
// app.post('/redirect', async(c) => {
//   const responseUrl = c.req.url
//   const responseBody =    await c.req.parseBody()
//   console.log("responseUrl == ", responseUrl)
//   console.log("responseBody == ", responseBody)

//   return c.json({
//     responseUrl,
//     responseBody
//   })
// })
app.get('/redirect', async (c) => {
  const responseUrl = c.req.url
  const responseBody = await c.req.parseBody()
  console.log("responseUrl == ", responseUrl)
  console.log("responseBody == ", responseBody)

  return c.json({
    responseUrl,
    responseBody
  })
})

Deno.serve({ port: 5000 }, app.fetch)



// Scopes
// Scopes are sent to the authorize url as a comma or space separated list, to request optional permissions for a user.

//   read_summaries - access user’s Summaries and Stats including categories, dependencies, editors, languages, machines, operating systems, and projects.Consider instead requesting scopes for only the summaries you need.For ex: scope = read_summaries.languages, read_summaries.editors to only request access to the user’s language and editor summaries and stats.
//     read_summaries.categories - access user’s Summaries and Stats, limited to the user’s categories.
//       read_summaries.dependencies - access user’s Summaries and Stats, limited to the user’s dependencies.
//         read_summaries.editors - access user’s Summaries and Stats, limited to the user’s editors.
//           read_summaries.languages - access user’s Summaries and Stats, limited to the user’s languages.
//             read_summaries.machines - access user’s Summaries and Stats, limited to the user’s machines.
//               read_summaries.operating_systems - access user’s Summaries and Stats, limited to the user’s operating systems.
//                 read_summaries.projects - access user’s Summaries and Stats, limited to the user’s projects.
//                   read_stats - access user’s Stats including categories, dependencies, editors, languages, machines, operating systems, and projects.Consider instead requesting scopes for only the stats you need.For ex: scope = read_stats.languages, read_stats.editors to only request access to the user’s language and editor stats.
//                     read_stats.best_day - access user’s Stats, limited to the user’s best day in the requested time range.
//                       read_stats.categories - access user’s Stats, limited to the user’s categories.
//                         read_stats.dependencies - access user’s Stats, limited to the user’s dependencies.
//                           read_stats.editors - access user’s Stats, limited to the user’s editors.
//                             read_stats.languages - access user’s Stats, limited to the user’s languages.
//                               read_stats.machines - access user’s Stats, limited to the user’s machines.
//                                 read_stats.operating_systems - access user’s Stats, limited to the user’s operating systems.
//                                   read_stats.projects - access user’s Stats, limited to the user’s projects.
//                                     read_goals - access user’s Goals.
//                                       read_orgs - access user’s organizations, and coding activity for dashboard members.
//                                         write_orgs - modify user’s organizations, and org dashboards.
//                                           read_private_leaderboards - access user’s private leaderboards.
//                                             write_private_leaderboards - modify user’s private leaderboards, including adding / removing members when current user had Admin or Owner role.
//                                               read_heartbeats - access user’s coding activity, projects, files, editors, languages, operating systems, dependencies, Stats, Durations, External Durations, and Heartbeats.If you don’t need access to Durations or Heartbeats, consider only requesting read_summaries scope instead.
//                                                 write_heartbeats - modify user’s coding activity with the ability to create, edit, and delete Heartbeats and External Durations.
//                                                   email - access user’s private email address; not necessary for user’s public email and public profile info.
