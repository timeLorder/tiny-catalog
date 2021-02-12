import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "index.ts",
  output: [
    { name: "TinyCatalogCore", file: pkg.main, format: "cjs" },
    { name: "TinyCatalogCore", file: pkg.module, format: "es" },
  ],
  plugins: [babel(), typescript()],
};
