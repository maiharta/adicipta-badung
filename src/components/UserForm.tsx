"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userFormSchema } from "@/lib/schemas";
import { createUser, updateUser } from "@/lib/actions";
import { toast } from "sonner";
import { User } from "@/lib/definitions";

type UserFormProps =
  | {
      mode: "create";
      user?: User;
    }
  | {
      mode: "edit";
      user: User;
    }
  | {
      mode: "view";
      user: User;
    };

export const UserForm = ({ mode, user }: UserFormProps) => {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(
      userFormSchema.omit({ ...(mode === "edit" ? { password: true } : {}) })
    ),
    defaultValues: {
      username: user?.username ?? "",
      password: "",
      role: user?.role,
    },
  });

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    if (mode === "create") {
      const { error } = (await createUser(values)) || {};
      if (!error) {
        toast.success("Tambah berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    } else if (mode === "edit") {
      const { error } = (await updateUser(user.id, values)) || {};
      if (!error) {
        toast.success("Edit berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {mode === "create" && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={mode === "view"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="INPUTER">Inputer</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {(mode === "create" || mode === "edit") && (
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Simpan"}
          </Button>
        )}
      </form>
    </Form>
  );
};
