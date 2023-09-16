import c from "cohere-ai";

import { env } from "~/env.mjs";

c.init(env.COHERE_API_KEY);

export const cohere = c;
