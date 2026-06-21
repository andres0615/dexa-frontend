import { useState, type ReactNode } from 'react'
import Sidebar from '../sidebar/Sidebar'
import { useLayoutContext } from '../../contexts/LayoutContext'

interface LayoutProps {
  children: ReactNode
}

export default function LayoutAdmin({ children }: LayoutProps) {
  const { maxWidth } = useLayoutContext()

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
            <div className={`${maxWidth} mx-auto py-8`}>
                {/* Content */}
                {children}
            </div>
        </main>
    </div>
    </>
  )
}
