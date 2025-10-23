export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-1 border-4 border-gray-200 border-t-transparent rounded-full animate-spin-slow"></div>
    </div>
  </div>
);
