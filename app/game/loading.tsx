import Image from "next/image";
export default function Loading() {
  return (
    <div className="relative flex items-center w-full h-[75vh] max-w-6xl px-6 lg:mx-auto">
      {/* Main content area */}
      <main className="flex-1 min-w-0 h-full pt-6 flex flex-col items-center justify-center gap-2">
        <Image src="/images/coyote-running-loading-transparent.gif" alt="" width={150} height={150} className="" />
        <div className="text-lg  italic text-stone-700 animate-pulse">LOADING...</div>
      </main>
    </div>
  )
}