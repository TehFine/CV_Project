import { Card } from "@/components/ui/card"

export default function CategoryList() {

  const categories = [
    "Kinh doanh/Bán hàng",
    "Marketing/PR/Quảng cáo",
    "Chăm sóc khách hàng",
    "Nhân sự/Hành chính",
    "Công nghệ thông tin",
    "Lao động phổ thông"
  ]

  return (

    <Card className="p-4">

      {categories.map((item, index) => (

        <div
          key={index}
          className="py-3 border-b cursor-pointer hover:text-green-600"
        >
          {item}
        </div>

      ))}

    </Card>

  )
}