import { createClient } from "naria2";
import { createChildProcess } from "@naria2/node";

const client = await createClient(createChildProcess());

console.log(client.options);
