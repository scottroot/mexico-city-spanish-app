import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        {children}
      </div>
    </div>
  )
}