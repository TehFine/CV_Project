import JobSearch from "./JobSearch"
import CategoryList from "../job/CategoryList"
import MarketCard from "../job/MarketCard"

export default function HeroSection() {

  return (

    <div className="w-full bg-gradient-to-r from-green-900 to-green-600 pt-10 pb-16">

      <div className="max-w-[1200px] mx-auto">

        {/* TITLE */}

        <h1 className="text-center text-3xl text-green-300 font-bold mb-8">
          TopCV - Tạo CV, Tìm việc làm, Tuyển dụng hiệu quả
        </h1>

        <JobSearch />

        {/* CONTENT */}

        <div className="grid grid-cols-3 gap-6 mt-8">

          <CategoryList />

          <div className="col-span-2">

            <MarketCard />

          </div>

        </div>

      </div>

    </div>

  )
}