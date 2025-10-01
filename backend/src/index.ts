import { createApp } from "./utils/createApp.ts";

const app = createApp({ enableWeb: true, enableApi: true });
const PORT = 8012;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
