import Image from 'next/image'
import Link from 'next/link'

export default function Example() {
  return (
    <>
      <main className="flex flex-col justify-center items-center bg-white px-6 pt-10">
        <div className="block h-full flex-1 grow text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <Image 
            src="/images/coyote-lost.webp" 
            width={125} 
            height={125} 
            alt="Coyote Lost" 
            className="mx-auto my-4"
          />
          <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tight text-balance text-gray-900">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {"Sorry, we couldn’t find the page you’re looking for."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            > 
              Go back home <span aria-hidden="true">&rarr;</span>
            </Link>
            {/* <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a> */}
          </div>
        </div>
      </main>
    </>
  )
}
