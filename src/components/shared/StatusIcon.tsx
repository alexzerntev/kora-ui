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
  running: { color: 'var(--color-status-done)', icon: TbCircleFilled },
  completed: { color: 'var(--color-status-done)', icon: TbCircleCheck },
  failed: { color: 'var(--color-status-failed)', icon: TbCircleX },
  paused: { color: 'var(--color-status-processing)', icon: TbPlayerPause },
}

export function StatusIcon({ variant, size = 14 }: StatusIconProps) {
  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon
  return <Icon size={size} style={{ color: config.color, flexShrink: 0 }} />
}
