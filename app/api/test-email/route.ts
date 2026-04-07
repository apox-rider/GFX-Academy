import { NextRequest, NextResponse } from 'next/server'
import { sendContactNotification, sendAutoReply } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const testContact = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message to verify email functionality.',
    }

    console.log('Sending test contact notification...')
    const notificationResult = await sendContactNotification(testContact)

    console.log('Sending test auto-reply...')
    const autoReplyResult = await sendAutoReply(testContact.email, testContact.name)

    return NextResponse.json({
      success: true,
      results: {
        notification: notificationResult,
        autoReply: autoReplyResult,
      },
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
