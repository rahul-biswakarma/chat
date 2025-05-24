import { Button } from "@/components/ui/button";

export const Onboarding = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center">
      <Button>Create Room</Button>
      <Button>Join Room</Button>
    </div>
  );
};
