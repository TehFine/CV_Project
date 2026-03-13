import { Card } from "@/components/ui/card"

export default function MarketCard() {

  return (

    <Card className="p-6 bg-green-600 text-white">

      <h3 className="text-xl font-bold mb-4">
        Thị trường việc làm hôm nay
      </h3>

      <div className="flex gap-10">

        <div>
          <div className="text-2xl font-bold">
            60.322
          </div>
          <div>
            Việc làm đang tuyển
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold">
            3.248
          </div>
          <div>
            Việc làm mới hôm nay
          </div>
        </div>

      </div>

    </Card>

  )
}