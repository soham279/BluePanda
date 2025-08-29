import { DashboardPage } from "@/components/dashboard-page"
import { Button } from "@/components/ui/button"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { PlusIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardPageContent } from "./dashboard-page-content"

const Page = async () => {
    const auth = await currentUser()

    if(!auth) {
        redirect("/sign-in")
    }

    const user = await db.user.findUnique({
        where: {externalId: auth.id}
    })

    if(!user){
        redirect("/sign-in")
    }
    return (
        <DashboardPage title="Dashboard">
            <DashboardPageContent />
        </DashboardPage>
    )
}

export default Page