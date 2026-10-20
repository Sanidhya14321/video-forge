import { z } from "zod";
import { writeFile } from "node:fs/promises";
import { projectSchema } from "../src/schema.js";
await writeFile(
  new URL("../docs/project.schema.json", import.meta.url),
  JSON.stringify(
    z.toJSONSchema(projectSchema, {
      target: "draft-2020-12",
      unrepresentable: "any",
    }),
    null,
    2,
  ) + "\n",
);
import {codeProjectSchema} from '../src/code-project.js';
await writeFile(new URL('../docs/code-project.schema.json',import.meta.url),JSON.stringify(z.toJSONSchema(codeProjectSchema,{target:'draft-2020-12',unrepresentable:'any'}),null,2)+'\n');
