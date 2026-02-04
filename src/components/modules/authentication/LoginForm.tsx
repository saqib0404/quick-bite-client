"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm(props: React.ComponentProps<typeof Card>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // const [didSubmitOnce, setDidSubmitOnce] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const appUrl =
        process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000";

    // show success toast after register redirect: /login?registered=1
    React.useEffect(() => {
        if (searchParams.get("registered") === "1") {
            toast.success("Account created successfully. Please login to continue.");
        }
    }, [searchParams]);

    const defaultValues: LoginValues = {
        email: "",
        password: "",
    };

    const form = useForm({
        defaultValues,
        validators: { onSubmit: loginSchema },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Signing in...");

            try {
                const { error } = await authClient.signIn.email({
                    email: value.email,
                    password: value.password,
                    callbackURL: appUrl,
                });

                if (error) {
                    toast.error(error.message ?? "Invalid credentials", { id: toastId });
                    return;
                }

                toast.success("Welcome back!", { id: toastId });

                router.push("/dashboard");
            } catch {
                toast.error("Something went wrong, please try again.", { id: toastId });
            }
        },
    });

    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: appUrl,
            });
        } catch {
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <Card {...props} className={`w-full overflow-hidden border-none shadow-xl ${props.className ?? ""}`}>
            <div className="grid lg:grid-cols-2">
                {/* Left panel */}
                <div className="hidden lg:block p-10 bg-linear-to-b ml-5 rounded-2xl from-muted/40 to-background">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold leading-tight">
                            Welcome back to <span className="text-primary">Quick Bite</span>
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Sign in to continue ordering meals or managing your restaurant.
                        </p>

                        <div className="mt-8 rounded-2xl border bg-background/60 p-5">
                            <p className="text-sm font-semibold">Tips</p>
                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                <li>• Use your email & password</li>
                                <li>• Or continue with Google</li>
                                <li>• Keep your account secure</li>
                            </ul>
                        </div>

                        <p className="mt-10 text-xs text-muted-foreground">
                            Need an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Create one
                            </Link>
                            .
                        </p>
                    </div>
                </div>

                {/* Right panel */}
                <div className="p-6 sm:p-10">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl sm:text-3xl">Sign in</CardTitle>
                        <CardDescription className="mt-2">
                            Enter your email and password to access your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        <form
                            id="login-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // setDidSubmitOnce(true);
                                form.handleSubmit();
                            }}
                            className="space-y-4"
                        >
                            <FieldGroup>
                                <form.Field
                                    name="email"
                                    children={(field) => {
                                        // const isInvalid =
                                            // (field.state.meta.isTouched || didSubmitOnce) &&
                                            // !field.state.meta.isValid;

                                        return (
                                            // <Field data-invalid={isInvalid}>
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="email"
                                                    autoComplete="email"
                                                    placeholder="you@example.com"
                                                    className="h-11"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    disabled={form.state.isSubmitting}
                                                />
                                                {/* {isInvalid && <FieldError errors={field.state.meta.errors} />} */}
                                            </Field>
                                        );
                                    }}
                                />

                                <form.Field
                                    name="password"
                                    children={(field) => {
                                        // const isInvalid =
                                        //     (field.state.meta.isTouched || didSubmitOnce) &&
                                        //     !field.state.meta.isValid;

                                        return (
                                            // <Field data-invalid={isInvalid}>
                                            <Field>
                                                <div className="flex items-center justify-between">
                                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                    <Link
                                                        href="/forgot-password"
                                                        className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                                                    >
                                                        Forgot?
                                                    </Link>
                                                </div>

                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type={showPassword ? "text" : "password"}
                                                        autoComplete="current-password"
                                                        placeholder="Enter password"
                                                        className="h-11 pr-10"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        disabled={form.state.isSubmitting}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((p) => !p)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                        disabled={form.state.isSubmitting}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* {isInvalid && <FieldError errors={field.state.meta.errors} />} */}
                                            </Field>
                                        );
                                    }}
                                />
                            </FieldGroup>
                        </form>

                        <Separator className="my-6" />

                        <div className="text-sm text-muted-foreground">
                            Don’t have an account?{" "}
                            <Link href="/register" className="font-medium text-primary hover:underline">
                                Register
                            </Link>
                        </div>
                    </CardContent>

                    <CardFooter className="px-0 flex flex-col mt-3 gap-3">
                        <form.Subscribe
                            selector={(s) => s.isSubmitting}
                            children={(isSubmitting) => (
                                <>
                                    <Button
                                        form="login-form"
                                        type="submit"
                                        className="w-full h-11"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>

                                    <Button
                                        onClick={handleGoogleLogin}
                                        variant="outline"
                                        type="button"
                                        className="w-full h-11"
                                        disabled={isSubmitting}
                                    >
                                        Continue with Google
                                    </Button>
                                </>
                            )}
                        />
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}
