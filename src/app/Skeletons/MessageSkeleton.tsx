import React from "react";

const MessageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 p-4 animate-pulse">
      {/* Left message (received) */}
      <div className="flex items-start gap-2 mt-5">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="flex flex-col space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded-lg" />
          <div className="w-48 h-4 bg-gray-300 rounded-lg" />
        </div>
      </div>

      {/* Right message (sent) */}
      <div className="flex items-start justify-end gap-2">
        <div className="flex flex-col space-y-2 items-end">
          <div className="w-40 h-4 bg-gray-300 rounded-lg" />
          <div className="w-24 h-4 bg-gray-300 rounded-lg" />
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>

      {/* Left message (received) */}
      <div className="flex items-start gap-2 mt-5">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="flex flex-col space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded-lg" />
          <div className="w-48 h-4 bg-gray-300 rounded-lg" />
        </div>
      </div>

      {/* Right message (sent) */}
      <div className="flex items-start justify-end gap-2">
        <div className="flex flex-col space-y-2 items-end">
          <div className="w-40 h-4 bg-gray-300 rounded-lg" />
          <div className="w-24 h-4 bg-gray-300 rounded-lg" />
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>

      {/* Left message (received) */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="flex flex-col space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded-lg" />
          <div className="w-48 h-4 bg-gray-300 rounded-lg" />
        </div>
      </div>

      {/* Right message (sent) */}
      <div className="flex items-start justify-end gap-2">
        <div className="flex flex-col space-y-2 items-end">
          <div className="w-40 h-4 bg-gray-300 rounded-lg" />
          <div className="w-24 h-4 bg-gray-300 rounded-lg" />
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>

      {/* Left message (received) */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="flex flex-col space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded-lg" />
          <div className="w-48 h-4 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
