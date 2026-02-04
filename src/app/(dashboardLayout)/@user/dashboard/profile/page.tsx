import { ProfileCard } from "@/components/modules/profile/profile-card";
import { userService } from "@/services/user.service";

export default async function ProfilePage() {
    const { data, error } = await userService.getMe();


    return <ProfileCard initialMe={data} initialError={error?.message ?? null} />;
}
