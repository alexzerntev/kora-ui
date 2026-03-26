import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { avataaars } from '@dicebear/collection'

interface AvatarProps {
  seed: string
  size?: number
}

export function Avatar({ seed, size = 110 }: AvatarProps) {
  const svg = useMemo(() => {
    const avatar = createAvatar(avataaars, {
      seed,
      size,
      mouth: ['serious', 'smile', 'default'],
      eyes: ['default', 'happy', 'side'],
      eyebrows: ['default', 'defaultNatural', 'flatNatural'],
    })
    return avatar.toDataUri()
  }, [seed, size])

  return (
    <img
      src={svg}
      alt={seed}
      width={size}
      height={size}
    />
  )
}
