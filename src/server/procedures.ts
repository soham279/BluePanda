import { PrismaClient } from "@prisma/client"
import { j } from "./__internals/j"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"

const authMiddleware = j.middleware(async({ c,next }) => {
  const authHeader = c.req.header("Authorization")
  if (authHeader) {
    // Bearer <API_KEY>
    const apiKey = authHeader.split(" ")[1]
    const user = await db.user.findUnique({
      where: { apiKey },
    })
    if (user) return next({ user })
  }

  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }
})
/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)
