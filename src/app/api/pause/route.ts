import { NextResponse } from 'next/server'
import { timerStore } from '@/lib/serverStore'

export async function POST() {
  timerStore.pause()
  return NextResponse.json({ ok: true, running: false })
}