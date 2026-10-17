"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function AddUserPage() {
  const handleAddNewUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = Object.fromEntries(formData.entries());
    console.log(newUser)
  }
  return (
    <form onSubmit={handleAddNewUser}>
      <FieldGroup className="mx-auto w-60">
        <Field>
          <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
          <Input id="fieldgroup-name" name="name" placeholder="Jordan Lee" />
        </Field>
        <Field>
          <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
          <Input
            id="fieldgroup-email"
            name="email"
            type="email"
            placeholder="name@example.com"
          />
          <FieldDescription>
            We&apos;ll send updates to this address.
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <Button type="submit">Add User</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
