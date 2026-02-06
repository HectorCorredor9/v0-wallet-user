import { redirect } from 'next/navigation'
import { appPath } from '@/lib/tenant-path'

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; id: string }>
}) {
  const { tenantId } = await params
  redirect(appPath(tenantId, 'cards'))
}
