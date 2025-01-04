export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-indigo-200 rounded-full opacity-75"></div>
        <div className="absolute w-full h-full border-4 border-stone-950 rounded-full animate-[spin_0.8s_linear_infinite] border-t-transparent"></div>
      </div>
    </div>
  );
} 