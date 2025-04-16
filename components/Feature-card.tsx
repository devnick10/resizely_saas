import Image from "next/image"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  src: string
}

export default function FeatureCard({ icon, title, description, src }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <Image
        src={src}
        width={1000}
        height={1000}
        alt="image"
        className="object-cover rounded-lg"
      />
      <div className="flex items-center my-2 py-2 gap-2 justify-center">
          {icon}
          <h3 className="text-xl font-bold ">{title}</h3>
      </div>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}
