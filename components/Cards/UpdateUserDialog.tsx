"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface User {
  _id: string
  name: string
  email: string
}

const UpdateUserDialog = ({ user }: { user: User }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const updatedUser = Object.fromEntries(formData.entries())

    setIsSaving(true)
    setUpdateError(null)

    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!res.ok) {
        throw new Error(`Update failed with status ${res.status}.`)
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Unable to update this user.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setUpdateError(null)
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="mx-4" variant="outline">
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleUpdateUser}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                defaultValue={user.name}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="email-1">Email</Label>
              <Input
                id="email-1"
                type="email"
                name="email"
                defaultValue={user.email}
                required
              />
            </Field>
          </FieldGroup>
          {updateError && (
            <p role="alert" className="text-sm text-destructive">
              {updateError}
            </p>
          )}
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" type="button" disabled={isSaving}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserDialog
