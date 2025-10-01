import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      subscriptionTier: string
    } & DefaultSession["user"]
  }

  interface User {
    subscriptionTier: string
  }
}
