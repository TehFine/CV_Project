import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, FileText, Bookmark, Send, ChevronDown } from 'lucide-react'
import { ProfileTab } from './profile/ProfileTab'
import { CVTab }      from './profile/CVTab'
import { AppliedTab } from './profile/AppliedTab'
import { SavedTab }   from './profile/SavedTab'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'info',    label: 'Hồ sơ',               icon: User },
  { key: 'cvs',    label: 'CV của tôi',            icon: FileText },
  { key: 'applied',label: 'Việc đã ứng tuyển',    icon: Send },
  { key: 'saved',  label: 'Việc làm đã lưu',      icon: Bookmark },
]

const initials = name => {
  if (!name) return 'U'
  try { return name.trim().split(/\s+/).slice(-2).map(w => w[0]).join('').toUpperCase() || 'U' }
  catch { return 'U' }
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const currentTab = TABS.find(t => t.key === activeTab)

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Hero banner */}
      <div className="bg-linear-to-br from-slate-900 to-primary py-6 md:py-8">
        <div className="max-w-300 mx-auto px-4 md:px-6 flex items-center gap-4">
          <Avatar className="h-12 w-12 md:h-14 md:w-14 shrink-0">
            <AvatarFallback className="text-lg font-black bg-linear-to-br from-primary to-violet-600 text-white">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white leading-tight">{user?.name}</h1>
            <p className="text-blue-200 text-xs md:text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-300 mx-auto px-4 md:px-6 pt-4 md:pt-6 flex flex-col md:flex-row gap-4 md:gap-5 items-start">
        {/* Mobile tab selector */}
        <div className="w-full md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-xl border border-[#E2E8F0] text-sm font-semibold text-foreground">
            <span className="flex items-center gap-2">
              {currentTab && <currentTab.icon className="h-4 w-4 text-primary" />}
              {currentTab?.label}
            </span>
            <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', showMobileMenu && 'rotate-180')} />
          </button>
          {showMobileMenu && (
            <div className="mt-2 bg-white rounded-xl border border-[#E2E8F0] p-2 shadow-lg">
              {TABS.map(tab => {
                const Icon = tab.icon
                const active = activeTab === tab.key
                return (
                  <button key={tab.key} onClick={() => { setActiveTab(tab.key); setShowMobileMenu(false) }}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left',
                      active ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
                    )}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[180px] shrink-0 sticky top-20">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col gap-0.5">
                {TABS.map(tab => {
                  const Icon = tab.icon
                  const active = activeTab === tab.key
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={[
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full cursor-pointer',
                        active ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      ].join(' ')}>
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 w-full">
          {activeTab === 'info'    && <ProfileTab user={user} updateUser={updateUser} />}
          {activeTab === 'cvs'    && <CVTab />}
          {activeTab === 'applied' && <AppliedTab />}
          {activeTab === 'saved'  && <SavedTab />}
        </main>
      </div>
    </div>
  )
}