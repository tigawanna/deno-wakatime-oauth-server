import type { FC } from "hono/jsx";

export const Layout: FC = (props) => {
  return (
    <html data-theme="forest">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.12.14/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        {/* <script>
    tailwind.config = {
  daisyui: {
    themes: ["forest"],
  }
    }
  </script> */}
        <title>Wakatime</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
};
