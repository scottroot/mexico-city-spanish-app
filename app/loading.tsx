import Image from "next/image";
export default function Loading() {
  return (
    <div className="relative flex items-center w-full h-[75vh] max-w-6xl px-6 lg:mx-auto">
      {/* Main content area */}
      <main className="flex-1 min-w-0 h-full lg:pr-96 pt-6 flex flex-col items-center justify-center gap-2">
        <Image src="/images/coyote-running-loading-transparent.gif" alt="" width={150} height={150} className="" />
        <div className="text-lg  italic text-stone-700 animate-pulse">LOADING...</div>
      </main>

      {/* Right sidebar - only visible on xl screens and up */}
      <aside className="max-lg:hidden w-96 fixed right-0 top-0 h-screen pt-6 ">
        <div className="pt-6 pr-6 h-full pointer-events-auto space-y-6">
          {/* Premium Feature Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-[6ch] bg-gray-200 text-white px-3 py-1 rounded-full text-xs font-bold">
                &nbsp;
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 w-[16ch] bg-gray-200">&nbsp;</h3>
            <p className="text-sm text-gray-600 mb-1 w-[24ch] bg-gray-200">&nbsp;</p>
            <p className="text-sm text-gray-600 mb-3 w-[16ch] bg-gray-200">&nbsp;</p>
            <button className="w-full bg-gray-200 py-3 px-4 rounded-lg w-[24ch] rounded-full">
              &nbsp;
            </button>
          </div>

          {/* Daily Progress Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 w-[14ch]">&nbsp;</h3>
              <span className="text-blue-600 text-sm font-medium w-[8ch]">&nbsp;</span>
            </div>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-yellow-800 text-sm">⚡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 w-[18ch] animate-pulse">&nbsp;</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      {/* <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div> */}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 w-[15ch]">&nbsp;</p>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </aside>
    </div>
  )
}