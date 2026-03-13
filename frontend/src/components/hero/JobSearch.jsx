import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function JobSearch() {

  return (

    <div className="bg-white rounded-full flex items-center p-2 shadow-lg">

      <Input
        placeholder="Vị trí tuyển dụng, tên công ty"
        className="border-none focus-visible:ring-0"
      />

      <Input
        placeholder="Địa điểm"
        className="border-none focus-visible:ring-0"
      />

      <Button className="bg-green-600 rounded-full px-8">
        Tìm kiếm
      </Button>

    </div>

  )
}