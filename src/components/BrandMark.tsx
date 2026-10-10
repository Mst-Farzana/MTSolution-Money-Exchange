import Image from "next/image"

export default function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/logo.svg"
      alt="MT Solution"
      width={size}
      height={size}
      className="shrink-0 rounded-xl object-contain"
      priority
    />
  )
}
