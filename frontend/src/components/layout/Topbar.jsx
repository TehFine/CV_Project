import { Button } from "@/components/ui/button"

export default function Topbar() {

  return (

    <div className="w-full bg-white border-b">

      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16">

        {/* LOGO */}
        <div className="text-2xl font-bold text-green-600">
          topCV
        </div>

        {/* MENU */}
        <nav className="flex gap-8 text-sm">

          <div className="cursor-pointer hover:text-green-600">
            Việc làm
          </div>

          <div className="cursor-pointer hover:text-green-600">
            Tạo CV
          </div>

          <div className="cursor-pointer hover:text-green-600">
            Công cụ
          </div>

          <div className="cursor-pointer hover:text-green-600">
            Cẩm nang nghề nghiệp
          </div>

          <div className="cursor-pointer hover:text-green-600">
            TopCV Pro
          </div>

        </nav>

        {/* RIGHT */}
        <div className="flex gap-3">

          <Button variant="outline" className="rounded-full">
            Đăng ký
          </Button>

          <Button className="bg-green-600 hover:bg-green-700 rounded-full">
            Đăng nhập
          </Button>

          <Button variant="secondary" className="rounded-full">
            Đăng tuyển & tìm hồ sơ
          </Button>

        </div>

      </div>

    </div>

  )
}