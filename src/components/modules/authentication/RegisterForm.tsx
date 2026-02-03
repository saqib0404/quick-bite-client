"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type UserRole = "CUSTOMER" | "PROVIDER";

const registerSchema = z
    .object({
        role: z.enum(["CUSTOMER", "PROVIDER"]),
        name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
        email: z.string().trim().email("Enter a valid email"),

        // Keep as string values ("" allowed) so they match defaultValues types
        phone: z.string().trim().max(30, "Phone is too long").or(z.literal("")),
        businessName: z.string().trim().max(80, "Business name is too long").or(z.literal("")),

        password: z.string().min(8, "Minimum length is 8").max(72, "Password is too long"),
        confirmPassword: z.string(),
    })
    .refine((v) => v.password === v.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((v) => (v.role === "PROVIDER" ? v.businessName.trim().length >= 2 : true), {
        message: "Business name is required for providers",
        path: ["businessName"],
    });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm(props: React.ComponentProps<typeof Card>) {
    const router = useRouter();
    const [didSubmitOnce, setDidSubmitOnce] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const appUrl =
        process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000";

    const defaultValues: RegisterValues = {
        role: "CUSTOMER",
        name: "",
        email: "",
        phone: "",
        businessName: "",
        password: "",
        confirmPassword: "",
    };

    const form = useForm({
        defaultValues,
        validators: {
            onSubmit: registerSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating account...");

            try {
                const payload: any = {
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    callbackURL: appUrl,

                    role: value.role,

                    phone: value.phone.trim() ? value.phone.trim() : undefined,
                    businessName:
                        value.role === "PROVIDER" && value.businessName.trim()
                            ? value.businessName.trim()
                            : undefined,
                };

                const { error } = await authClient.signUp.email(payload);

                if (error) {
                    toast.error(error.message ?? "Registration failed", { id: toastId });
                    return;
                }

                toast.success("Account created successfully. Please login to continue.", {
                    id: toastId,
                });

                router.push("/login?registered=1");
            } catch {
                toast.error("Something went wrong, please try again.", { id: toastId });
            }
        },
    });

    const handleGoogleRegister = async () => {
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
                {/* Left panel (only on large screens) */}
                <div className="hidden lg:block p-10 bg-linear-to-b rounded-2xl ml-5 from-muted/40 to-background">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold leading-tight">
                            Join <span className="text-primary">Quick Bite</span>
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Register as a customer to order meals, or as a provider to register your restaurant and publish menu items.
                        </p>

                        <div className="mt-8 rounded-2xl border bg-background/60 p-5">
                            <p className="text-sm font-semibold">What you get</p>
                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                <li>• Smooth onboarding</li>
                                <li>• Secure authentication</li>
                                <li>• Clean provider dashboard flow</li>
                            </ul>
                        </div>

                        <p className="mt-10 text-xs text-muted-foreground">
                            By registering, you agree to our{" "}
                            <span className="underline underline-offset-4">Terms</span> and{" "}
                            <span className="underline underline-offset-4">Privacy</span>.
                        </p>
                    </div>
                </div>

                {/* Right panel */}
                <div className="p-6 sm:p-10">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl sm:text-3xl">Create an account</CardTitle>
                        <CardDescription className="mt-2">
                            Choose your account type and fill in the details below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {/* Role Tabs */}
                        <form.Field
                            name="role"
                            children={(field) => (
                                <div className="mb-6 space-y-2">
                                    <FieldLabel>Account type</FieldLabel>
                                    <Tabs
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v as UserRole)}
                                    >
                                        <TabsList className="grid w-full mb-3 grid-cols-2">
                                            <TabsTrigger className="" value="CUSTOMER">
                                                Customer
                                            </TabsTrigger>
                                            <TabsTrigger className="" value="PROVIDER">
                                                Provider
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>

                                    <p className="text-xs text-muted-foreground">
                                        {field.state.value === "PROVIDER"
                                            ? "Providers can register a restaurant and upload meals."
                                            : "Customers can browse restaurants and place orders."}
                                    </p>
                                </div>
                            )}
                        />

                        {/* Form */}
                        <form
                            id="register-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setDidSubmitOnce(true);
                                form.handleSubmit();
                            }}
                            className="space-y-4"
                        >
                            <FieldGroup>
                                <form.Field
                                    name="name"
                                    children={(field) => {
                                        const isInvalid =
                                            (field.state.meta.isTouched || didSubmitOnce) &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    autoComplete="name"
                                                    placeholder="John Doe"
                                                    className="h-11"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    disabled={form.state.isSubmitting}
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        );
                                    }}
                                />

                                <form.Field
                                    name="email"
                                    children={(field) => {
                                        const isInvalid =
                                            (field.state.meta.isTouched || didSubmitOnce) &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
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
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        );
                                    }}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <form.Field
                                        name="phone"
                                        children={(field) => {
                                            const isInvalid =
                                                (field.state.meta.isTouched || didSubmitOnce) &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Phone (optional)</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        placeholder="+971..."
                                                        className="h-11"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        disabled={form.state.isSubmitting}
                                                    />
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                </Field>
                                            );
                                        }}
                                    />

                                    <form.Subscribe
                                        selector={(s) => s.values.role}
                                        children={(role) =>
                                            role === "PROVIDER" ? (
                                                <form.Field
                                                    name="businessName"
                                                    children={(field) => {
                                                        const isInvalid =
                                                            (field.state.meta.isTouched || didSubmitOnce) &&
                                                            !field.state.meta.isValid;

                                                        return (
                                                            <Field data-invalid={isInvalid}>
                                                                <FieldLabel htmlFor={field.name}>Business name</FieldLabel>
                                                                <Input
                                                                    id={field.name}
                                                                    name={field.name}
                                                                    placeholder="Spice Garden"
                                                                    className="h-11"
                                                                    value={field.state.value}
                                                                    onBlur={field.handleBlur}
                                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                                    disabled={form.state.isSubmitting}
                                                                />
                                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                            </Field>
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <div />
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <form.Field
                                        name="password"
                                        children={(field) => {
                                            const isInvalid =
                                                (field.state.meta.isTouched || didSubmitOnce) &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type={showPassword ? "text" : "password"}
                                                            autoComplete="new-password"
                                                            placeholder="Create password"
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
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                </Field>
                                            );
                                        }}
                                    />

                                    <form.Field
                                        name="confirmPassword"
                                        children={(field) => {
                                            const isInvalid =
                                                (field.state.meta.isTouched || didSubmitOnce) &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type={showConfirm ? "text" : "password"}
                                                            autoComplete="new-password"
                                                            placeholder="Confirm password"
                                                            className="h-11 pr-10"
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            disabled={form.state.isSubmitting}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirm((p) => !p)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                                                            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                                            disabled={form.state.isSubmitting}
                                                        >
                                                            {showConfirm ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                </Field>
                                            );
                                        }}
                                    />
                                </div>
                            </FieldGroup>
                        </form>

                        <Separator className="my-6" />

                        <div className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>

                    {/* ✅ Loading state button via Subscribe (reliable) */}
                    <CardFooter className="px-0 flex flex-col mt-5 gap-3">
                        <form.Subscribe
                            selector={(s) => s.isSubmitting}
                            children={(isSubmitting) => (
                                <>
                                    <Button
                                        form="register-form"
                                        type="submit"
                                        className="w-full h-11"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Register"
                                        )}
                                    </Button>

                                    <Button
                                        onClick={handleGoogleRegister}
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
