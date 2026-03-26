import { useLottie } from 'lottie-react'
import { useEffect, useState } from 'react'

const LOTTIE_BASE = 'https://fonts.gstatic.com/s/e/notoemoji/latest'

interface AnimatedEmojiProps {
  codepoints: string
  fallback: string
  size?: number
}

function LottieEmoji({ animationData, size }: { animationData: object; size: number }) {
  const { View, play, stop, goToAndStop } = useLottie({
    animationData,
    loop: false,
    autoplay: false,
    style: { width: size, height: size },
  })

  useEffect(() => {
    goToAndStop(0, true)
  }, [])

  return (
    <div
      onMouseEnter={() => {
        goToAndStop(0, true)
        play()
      }}
      style={{ width: size, height: size, cursor: 'default' }}
    >
      {View}
    </div>
  )
}

export function AnimatedEmoji({ codepoints, fallback, size = 100 }: AnimatedEmojiProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${LOTTIE_BASE}/${codepoints}/lottie.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => { cancelled = true }
  }, [codepoints])

  if (failed || !animationData) {
    return (
      <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>
        {fallback}
      </span>
    )
  }

  return <LottieEmoji animationData={animationData} size={size} />
}
