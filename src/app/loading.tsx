import BounceLoader from "@/components/ui/bounce-loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BounceLoader />
    </div>
  );
}