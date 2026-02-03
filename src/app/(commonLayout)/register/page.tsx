import { RegisterForm } from "@/components/modules/authentication/RegisterForm";


export default function Page() {
    return (
        <div className="flex w-full items-center justify-center px-4 py-20">
            <div className="w-full max-w-6xl">
                <RegisterForm />
            </div>
        </div>
    );
}
