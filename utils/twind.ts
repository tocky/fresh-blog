import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
export * from "twind";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  theme: {
    container: {
      center: true,
      padding: {
        xs: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    }
  }
};
if (IS_BROWSER) setup(config);
