
import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";


export async function GET(request: Request) {

  const actionMetadata: ActionGetResponse = {
    icon: "https://www.nuflowerfoods.com/blogs/wp-content/uploads/2023/09/globe.jpg",
    title: "Vote for your favorite peanut butter!",
    description: "Vote between crunchy and smooth peanut butter.",
    label: "Vote",

  }

  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS })
}
