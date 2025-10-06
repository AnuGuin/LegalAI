import { Skeleton } from "@heroui/skeleton";

export function ConversationSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {/* User message skeleton */}
      <div className="flex items-start gap-3 justify-end">
        <div className="w-full max-w-[300px] flex items-center gap-3 flex-row-reverse">
          <div>
            <Skeleton className="flex rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg ml-auto" />
            <Skeleton className="h-3 w-4/5 rounded-lg ml-auto" />
          </div>
        </div>
      </div>

      {/* AI message skeleton */}
      <div className="flex items-start gap-3">
        <div className="w-full max-w-[300px] flex items-center gap-3">
          <div>
            <Skeleton className="flex rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      </div>

      {/* User message skeleton */}
      <div className="flex items-start gap-3 justify-end">
        <div className="w-full max-w-[300px] flex items-center gap-3 flex-row-reverse">
          <div>
            <Skeleton className="flex rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg ml-auto" />
            <Skeleton className="h-3 w-4/5 rounded-lg ml-auto" />
          </div>
        </div>
      </div>

      {/* AI message skeleton */}
      <div className="flex items-start gap-3">
        <div className="w-full max-w-[300px] flex items-center gap-3">
          <div>
            <Skeleton className="flex rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
