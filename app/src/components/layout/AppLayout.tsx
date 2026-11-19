import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const [menuAberto, setMenuAberto] = useState(false)
  return (
    <div className="flex min-h-screen">
      <Sidebar aberta={menuAberto} onFechar={() => setMenuAberto(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onAbrirMenu={() => setMenuAberto(true)} />
        <main className="mx-auto w-full max-w-[120rem] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
