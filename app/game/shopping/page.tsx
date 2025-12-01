import { getUser } from "@/utils/supabase/auth";
import ShoppingGameWrapper from "./ShoppingGameWrapper";


export default async function ShoppingGamePage() {
  const { error: userError, ...user } = await getUser();
  return (
    <div id="game-container" className="h-full w-full">
      <ShoppingGameWrapper user={user} />
    </div>
  )
}
