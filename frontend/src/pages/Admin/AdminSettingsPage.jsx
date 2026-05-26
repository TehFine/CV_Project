import { useState, useEffect } from 'react'
import { adminService, MOCK_SETTINGS } from '../../services/adminService'
import { 
  Globe, Shield, Cpu, Briefcase, Users, 
  Save, RefreshCw, CheckCircle2, AlertCircle,
  Mail, Phone, Lock, FileCode, ChevronRight,
  Settings, Bell, Database, Key
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(MOCK_SETTINGS)
  const [activeTab, setActiveTab] = useState('site')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const updateSetting = (group, field, value) => {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }))
  }

  const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
      <div className="space-y-1">
        <Label className="text-[15px] font-black text-slate-900">{label}</Label>
        {description && <p className="text-xs text-slate-400 font-medium">{description}</p>}
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none",
          checked ? 'bg-[#1549B8] shadow-lg shadow-blue-200' : 'bg-slate-200'
        )}
      >
        <span className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-sm",
          checked ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  )

  const menuItems = [
    { id: 'site', label: 'Cấu hình chung', icon: Globe, desc: 'Tên trang web, liên hệ, bảo trì' },
    { id: 'ai', label: 'Trí tuệ nhân tạo', icon: Cpu, desc: 'Chấm điểm CV, giới hạn AI' },
    { id: 'jobs', label: 'Quy trình tuyển dụng', icon: Briefcase, desc: 'Duyệt tin, thời hạn, giới hạn' },
    { id: 'users', label: 'Quản lý người dùng', icon: Users, desc: 'Xác minh, bảo mật, lưu trữ' },
    { id: 'security', label: 'Bảo mật & Quyền', icon: Shield, desc: 'Mật khẩu, quyền truy cập' },
  ]

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Thiết lập hệ thống</h1>
          <p className="text-slate-400 font-medium mt-2 text-sm">Tùy chỉnh các tham số vận hành và quy tắc bảo mật của NexCV</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {saved && (
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 size={16} /> Đã lưu thành công
             </div>
           )}
           <Button 
            onClick={handleSave} 
            disabled={loading}
            className="rounded-2xl h-12 px-8 font-black bg-[#1549B8] hover:bg-[#1e40af] shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-1">
          {/* Mobile: horizontal scrollable tabs */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 -mx-2 px-2 snap-x snap-mandatory">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex-shrink-0 snap-center flex items-center gap-3 px-4 py-3 rounded-[20px] transition-all text-left",
                  activeTab === item.id 
                    ? "bg-white shadow-lg shadow-slate-100 border border-slate-100" 
                    : "bg-slate-50 border border-transparent"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  activeTab === item.id ? "bg-[#1549B8] text-white" : "bg-white text-slate-400"
                )}>
                  <item.icon size={18} />
                </div>
                <div className="overflow-hidden">
                  <div className={cn("font-black text-xs", activeTab === item.id ? "text-slate-900" : "text-slate-500")}>
                    {item.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* Desktop: stacked layout */}
          <div className="hidden lg:block space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-[24px] transition-all text-left group",
                  activeTab === item.id 
                    ? "bg-white shadow-xl shadow-slate-100 border border-slate-100" 
                    : "hover:bg-slate-50 border border-transparent"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                  activeTab === item.id ? "bg-[#1549B8] text-white rotate-3" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600"
                )}>
                  <item.icon size={22} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className={cn("font-black text-sm", activeTab === item.id ? "text-slate-900" : "text-slate-500")}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium truncate">{item.desc}</div>
                </div>
                {activeTab === item.id && <ChevronRight size={16} className="text-[#1549B8]" />}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:block mt-10 p-6 bg-slate-900 rounded-[32px] text-white">
             <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase tracking-widest mb-2">
                <Settings size={12} /> System Status
             </div>
             <h4 className="text-sm font-bold mb-3">Phiên bản v1.2.0</h4>
             <p className="text-[11px] text-slate-400 leading-relaxed mb-4">Mọi thay đổi sẽ được ghi lại trong nhật ký quản trị.</p>
             <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Dịch vụ đang ổn định
             </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 animate-in fade-in duration-500 min-w-0">
          <div className="bg-white rounded-[24px] lg:rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-100/50 p-5 md:p-8 lg:p-10 min-h-[400px] lg:min-h-[600px]">
            {activeTab === 'site' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Thông tin chung</h3>
                  <p className="text-sm text-slate-400 font-medium">Quản lý nhận diện thương hiệu và thông tin liên hệ chính thức</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Tên nền tảng</Label>
                    <Input value={settings.site.siteName} onChange={e => updateSetting('site', 'siteName', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">URL chính thức</Label>
                    <Input value={settings.site.siteUrl} onChange={e => updateSetting('site', 'siteUrl', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Email quản trị</Label>
                    <Input value={settings.site.contactEmail} onChange={e => updateSetting('site', 'contactEmail', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Hotline hỗ trợ</Label>
                    <Input value={settings.site.contactPhone} onChange={e => updateSetting('site', 'contactPhone', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                </div>
                <Separator className="bg-slate-50" />
                <Toggle 
                  label="Chế độ bảo trì (Maintenance Mode)" 
                  description="Khi bật, người dùng sẽ không thể truy cập vào trang web và ứng dụng."
                  checked={settings.site.maintenanceMode} 
                  onChange={val => updateSetting('site', 'maintenanceMode', val)} 
                />
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Trí tuệ nhân tạo (AI)</h3>
                  <p className="text-sm text-slate-400 font-medium">Cấu hình các tham số cho công cụ phân tích và chấm điểm CV</p>
                </div>
                <Toggle 
                  label="Kích hoạt chấm điểm CV" 
                  description="Cho phép Nhà tuyển dụng sử dụng AI để đánh giá độ phù hợp của CV với công việc."
                  checked={settings.ai.cvScoreEnabled} 
                  onChange={val => updateSetting('ai', 'cvScoreEnabled', val)} 
                />
                <Separator className="bg-slate-50" />
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Dung lượng file tối đa (MB)</Label>
                    <Input type="number" value={settings.ai.maxFileSizeMB} onChange={e => updateSetting('ai', 'maxFileSizeMB', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Giới hạn chấm điểm / ngày</Label>
                    <Input type="number" value={settings.ai.dailyScoreLimit} onChange={e => updateSetting('ai', 'dailyScoreLimit', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Quy trình tuyển dụng</h3>
                  <p className="text-sm text-slate-400 font-medium">Quản lý cách thức vận hành của các tin đăng và phê duyệt</p>
                </div>
                <Toggle 
                  label="Phê duyệt tin đăng bắt buộc" 
                  description="Admin phải kiểm duyệt nội dung trước khi tin đăng được hiển thị công khai."
                  checked={settings.jobs.requireApproval} 
                  onChange={val => updateSetting('jobs', 'requireApproval', val)} 
                />
                <Separator className="bg-slate-50" />
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Số tin tối đa / Nhà tuyển dụng</Label>
                    <Input type="number" value={settings.jobs.maxJobsPerEmployer} onChange={e => updateSetting('jobs', 'maxJobsPerEmployer', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Thời gian hiển thị tin (Ngày)</Label>
                    <Input type="number" value={settings.jobs.jobExpiryDays} onChange={e => updateSetting('jobs', 'jobExpiryDays', e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-5" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Quản lý người dùng</h3>
                  <p className="text-sm text-slate-400 font-medium">Cấu hình các lớp bảo mật và giới hạn cho ứng viên/NTD</p>
                </div>
                <Toggle 
                  label="Xác minh pháp nhân Nhà tuyển dụng" 
                  description="Yêu cầu NTD tải lên giấy phép kinh doanh trước khi được phép đăng tin."
                  checked={settings.users.employerVerificationRequired} 
                  onChange={val => updateSetting('users', 'employerVerificationRequired', val)} 
                />
                <Separator className="bg-slate-50" />
                <Toggle 
                  label="Bắt buộc xác thực email" 
                  description="Gửi mã xác thực qua email khi người dùng đăng ký tài khoản mới."
                  checked={settings.users.emailVerificationRequired} 
                  onChange={val => updateSetting('users', 'emailVerificationRequired', val)} 
                />
              </div>
            )}

            {/* Security Tab Placeholder */}
            {activeTab === 'security' && (
               <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                     <Lock size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Bảo mật & Quyền hạn</h3>
                  <p className="text-slate-400 text-sm max-w-xs">Phần này đang được cập nhật các quy tắc bảo mật nâng cao và phân quyền chi tiết (RBAC).</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
