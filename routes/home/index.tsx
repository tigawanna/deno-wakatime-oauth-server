import { FC } from "hono/jsx";
import { Layout } from "../layout.tsx";
import { Hono } from "hono";

export const Home: FC = () => {
    return (
        <Layout>
            <div class={"flex flex-col justify-center items-center gap-2"}>
                <h1 class={"text-3xl"}>Kawatime</h1>
                    <form action="/oauth/authorize" method="post">
      <button class="btn btn-priary" type="submit">Authorize</button>
    </form>
            </div>
        </Layout>
    );
};
const app = new Hono({});

app.get("/", (c) => {
    return c.html(<Home />);
});

export { app as HomeRoute };

