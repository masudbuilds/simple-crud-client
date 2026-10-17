"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import UpdateUserDialog from "./UpdateUserDialog"

interface User {
  _id: string
  name: string
  email: string
}

const UsersCard = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleteUser = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        throw new Error(`Delete failed with status ${res.status}.`)
      }

      const result: { deletedCount?: number } = await res.json()
      if (!result.deletedCount) {
        throw new Error("The user was not deleted.")
      }

      router.refresh()
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete this user.",
      )
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute aspect-video bg-black/35" />

      <CardHeader>
        <CardAction>
          <h2>No Action</h2>
        </CardAction>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>Email: {user.email}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`/users/${user._id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
        <UpdateUserDialog user={user}/>
        <Button
          onClick={handleDeleteUser}
          variant="destructive"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
      {deleteError && (
        <p role="alert" className="px-6 pb-4 text-sm text-destructive">
          {deleteError}
        </p>
      )}
    </Card>
  )
}

export default UsersCard
