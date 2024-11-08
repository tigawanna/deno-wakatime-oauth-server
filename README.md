Wakatime enpoints

Oauth to authorize and get token 
```ts
  const wakatime_oauth_endoint = "https://wakatime.com/oauth/authorize ";

  const response_type = "token";
  const redirect_uri = `${my_app}/redirect`;
  const scope = "read_stats,read_summaries";

  const wakatimeAuthUrl = new URL(wakatime_oauth_endoint);
  wakatimeAuthUrl.searchParams.append("client_id", client_id);
  wakatimeAuthUrl.searchParams.append("response_type", response_type);
  wakatimeAuthUrl.searchParams.append("redirect_uri", redirect_uri);
  wakatimeAuthUrl.searchParams.append("scope", scope);
  // redirect to this url and get the code in the url and pass it to the token api

  //  response wil look something like 

  // https://6beeaf9bbae3cc.lhr.life/redirect#access_token=waka_tok_jzfbdhN8Jn9Gn5NZEjuHAnNqHyquj03FVrWOEomqyZmqCq22P&expires_at=2024-11-07T15%3A03%3A39Z&expires_in=432002&4e4refresh_token=waka_ref_5nVncyobrrqrr9dzscope=read_summaries&state=STATE&token_type=bearer&uid=018cc20e-ad5a-4d40-ad76-7d398731446f

type ResponseParams = {
    access_token:string;
    expires_at:string;
    expires_in:number;
    refresh_token:string;
    scope:string;
    state:string;
    token_type:string;
    uid:string
  }
```


get current user 

```ts
  const response =  await fetch("https://wakatime.com/api/v1/users/current",{
    headers: {
      "Authorization":"Bearer waka_tok_your_token"
    }
  })


export interface Response {
    data: Data;
}

export interface Data {
    id:                        string;
    email:                     string;
    timezone:                  string;
    timeout:                   number;
    writes_only:               boolean;
    created_at:                Date;
    location:                  null;
    logged_time_public:        boolean;
    needs_payment_method:      boolean;
    languages_used_public:     boolean;
    is_onboarding_finished:    boolean;
    show_machine_name_ip:      boolean;
    profile_url:               string;
    time_format_24hr:          null;
    date_format:               string;
    share_last_year_days:      null;
    city:                      null;
    twitter_username:          null;
    plan:                      string;
    time_format_display:       string;
    has_basic_features:        boolean;
    username:                  null;
    share_all_time_badge:      null;
    last_plugin:               string;
    is_email_confirmed:        boolean;
    public_profile_time_range: string;
    public_email:              null;
    invoice_id_format:         string;
    last_project:              string;
    full_name:                 null;
    color_scheme:              string;
    linkedin_username:         null;
    photo:                     string;
    last_heartbeat_at:         Date;
    human_readable_website:    null;
    website:                   null;
    photo_public:              boolean;
    default_dashboard_range:   string;
    wonderfuldev_username:     null;
    display_name:              string;
    has_premium_features:      boolean;
    weekday_start:             number;
    is_email_public:           boolean;
    durations_slice_by:        string;
    modified_at:               Date;
    last_plugin_name:          string;
    is_hireable:               boolean;
    last_language:             string;
    last_branch:               string;
    profile_url_escaped:       string;
    github_username:           null;
    bio:                       null;
    meetings_over_coding:      boolean;
}


```
how to use access token 
>[!NOTE]
> access token can either be passed in the url params or in the headers

```ts
  const summariesEndpoint = new URL("https://wakatime.com/api/v1/users/current/summaries"); 
   if(temp_access_token){
     summariesEndpoint.searchParams.append("access_token", temp_access_token);
   }
   summariesEndpoint.searchParams.append("start", "11/01/2024");
   summariesEndpoint.searchParams.append("end", "11/02/2024");
  const response =  await fetch(summariesEndpoint.toString(),{
    headers: {
      "Authorization":"Bearer "+temp_access_token
  }})
```

constribute to pocketbase checklist

To add your own OAuth provider to the `pocketbase/pocketbase` repository, you'll need to modify several files. Here are the key files and the changes you need to make:

1. **`forms/record_oauth2_login.go`**: Add your new provider to the validation and submission logic.
   - Example changes: [link](https://github.com/pocketbase/pocketbase/blob/26ef0c697c5d95f4a9da13090797673ac36e5bc0/forms/record_oauth2_login.go)

2. **`ui/src/providers.js`**: Add your provider's configuration, including `key`, `title`, `logo`, and optional configuration components.
   - Example changes: [link](https://github.com/pocketbase/pocketbase/blob/26ef0c697c5d95f4a9da13090797673ac36e5bc0/ui/src/providers.js)

3. **`tools/auth/base_provider.go`**: Implement methods for the new provider (e.g., `SetRedirectUrl`, `AuthUrl`, `TokenUrl`, `UserApiUrl`, `FetchToken`, `FetchRawUserData`).
   - Example changes: [link](https://github.com/pocketbase/pocketbase/blob/26ef0c697c5d95f4a9da13090797673ac36e5bc0/tools/auth/base_provider.go)

4. **`apis/record_auth.go`**: Add your provider to the OAuth2 authentication flow.
   - Example changes: [link](https://github.com/pocketbase/pocketbase/blob/26ef0c697c5d95f4a9da13090797673ac36e5bc0/apis/record_auth.go)

5. **`models/settings/settings.go`**: Add your provider's configuration to the settings model.
   - Example changes: [link](https://github.com/pocketbase/pocketbase/blob/26ef0c697c5d95f4a9da13090797673ac36e5bc0/models/settings/settings.go)

6. **`tools/auth/auth.go`**: Register your new provider in the provider factory.
   - Example changes: [link](https://github.com/pocketbase/pocketbase/blob/26ef0c697c5d95f4a9da13090797673ac36e5bc0/tools/auth/auth.go)

Refer to the PR changes for a detailed view of how new providers are added: [PR #3948 Files](https://github.com/pocketbase/pocketbase/pull/3948/files).
