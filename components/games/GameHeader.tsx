'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface GameHeaderProps {
  title: string
  type: string
  difficulty: string
}

export default function GameHeader({ title, type, difficulty }: GameHeaderProps) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 h-14 max-w-6xl mx-auto flex items-center justify-start gap-3">
      <Link href="/games">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-sm font-semibold text-gray-800">{title}</h1>
        <p className="text-xs text-gray-500 capitalize">
          {type} • {difficulty}
        </p>
      </div>
    </div>
  )
}
