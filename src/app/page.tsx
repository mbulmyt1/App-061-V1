import { GetStartedButton } from "@/components/get-started-button";

export default function Page() {
  return (
    <div className="flex justify-center gap-8 flex-col items-center text-center py-10">
      <h1 className="text-4xl md:text-6xl font-bold">Better Authy</h1>
      <GetStartedButton />
    </div>
  );
}
