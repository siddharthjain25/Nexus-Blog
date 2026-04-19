import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div 
      className={cn("animate-pulse bg-slate-800/50 rounded-lg", className)} 
    />
  );
};

export const HomeSkeleton = () => {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4 sm:h-16" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-5/6 max-w-xl" />
        <div className="pt-4">
          <Skeleton className="h-14 w-full max-w-md rounded-2xl" />
        </div>
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-bg-card border border-border-subtle rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="pt-4 flex justify-between">
              <Skeleton className="h-6 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PostDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <Skeleton className="h-6 w-32" />
      
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full sm:h-16" />
        <div className="flex items-center gap-6 pb-8 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-64 w-full rounded-2xl mt-8" />
        <Skeleton className="h-4 w-full mt-8" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};
