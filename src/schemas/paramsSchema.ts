import { z } from "zod";

const paramsSchema = z.object({
  id: z.coerce.number().int(),
});

export default paramsSchema;
