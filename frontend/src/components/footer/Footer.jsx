import FooterColumn from "./FooterColumn"

import {
  Linkedin,
  Facebook,
  Youtube,
  Phone,
  Mail
} from "lucide-react"

export default function Footer() {

  return (

    <footer className="w-full bg-gradient-to-r from-black to-red-900 pt-16 pb-8">

      <div className="max-w-[1200px] mx-auto grid grid-cols-5 gap-10">

        {/* LOGO + SOCIAL */}

        <div>

          <div className="text-3xl font-bold text-white mb-2">
            itviec
          </div>

          <p className="text-gray-400 text-sm mb-6">
            BUILD YOU THEN BUILD IMPACT
          </p>

          <div className="flex gap-4 text-gray-400">

            <Linkedin className="cursor-pointer hover:text-white" />

            <Facebook className="cursor-pointer hover:text-white" />

            <Youtube className="cursor-pointer hover:text-white" />

          </div>

        </div>

        {/* ABOUT */}

        <FooterColumn
          title="About Us"
          items={[
            "Home",
            "About Us",
            "AI Match Service",
            "Contact Us",
            "All Jobs",
            "FAQ"
          ]}
        />

        {/* CAMPAIGN */}

        <FooterColumn
          title="Campaign"
          items={[
            "IT Story",
            "Writing Contest",
            "Featured IT Jobs",
            "Annual Survey"
          ]}
        />

        {/* TERMS */}

        <FooterColumn
          title="Terms & Conditions"
          items={[
            "Privacy Policy",
            "Operating Regulation",
            "Complaint Handling",
            "Terms & Conditions",
            "Press"
          ]}
        />

        {/* CONTACT */}

        <div>

          <h3 className="text-white font-semibold mb-4">
            Want to post a job? Contact us at:
          </h3>

          <div className="space-y-3 text-gray-400 text-sm">

            <div className="flex gap-2 items-center">
              <Phone size={16}/>
              Ho Chi Minh: (+84) 977 460 519
            </div>

            <div className="flex gap-2 items-center">
              <Phone size={16}/>
              Ha Noi: (+84) 983 131 351
            </div>

            <div className="flex gap-2 items-center">
              <Mail size={16}/>
              Email: love@itviec.com
            </div>

          </div>

        </div>

      </div>

      {/* LINE */}

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">

        Copyright © IT VIEC JSC |
        Tax code: 0312192258

      </div>

    </footer>

  )
}