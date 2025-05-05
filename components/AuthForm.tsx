
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const authFormSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    name: type === "sign-up" ? z.string().min(3, "Name is too short") : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, "Password too short"),
  });

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const isSignIn = type === "sign-in";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isSignIn) {
        const userCred = await signInWithEmailAndPassword(auth, data.email, data.password);
        const idToken = await userCred.user.getIdToken(true);

        await signIn({ email: data.email, idToken });
        toast.success("Signed in successfully");
        router.push("/"); // ✅ Redirect to home
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);

        await signUp({
          uid: userCred.user.uid,
          name: data.name!,
          email: data.email,
          password: data.password,
        });

        const idToken = await userCred.user.getIdToken(true);
        await signIn({ email: data.email, idToken });
        toast.success("Signed up successfully");
        router.push("/sign-in"); // ✅ Redirect to sign-in
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField control={form.control} name="name" label="Name" placeholder="Your name" />
            )}
            <FormField control={form.control} name="email" label="Email" placeholder="Your email" type="email" />
            <FormField control={form.control} name="password" label="Password" placeholder="Your password" type="password" />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

