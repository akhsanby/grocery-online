import { web } from "./app/web.js";

web.listen(8000, () => {
  console.info("App start in http://localhost:8000");
});
