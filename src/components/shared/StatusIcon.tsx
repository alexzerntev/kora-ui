import { TbCircleFilled, TbCircleCheck, TbCircleX, TbPlayerPause } from 'react-icons/tb'

export type StatusIconVariant = 'running' | 'completed' | 'failed' | 'paused'

interface StatusIconProps {
  variant: StatusIconVariant
  size?: number
}

const VARIANT_CONFIG: Record<
  StatusIconVariant,
  { color: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }
> = {
  running: { color: '#10b981', icon: TbCircleFilled },
  completed: { color: '#10b981', icon: TbCircleCheck },
  failed: { color: '#ef4444', icon: TbCircleX },
  paused: { color: '#f59e0b', icon: TbPlayerPause },
}

export function StatusIcon({ variant, size = 14 }: StatusIconProps) {
  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon
  return <Icon size={size} style={{ color: config.color, flexShrink: 0 }} />
}
