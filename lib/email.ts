import { Resend } from 'resend'

const FROM = 'CareerSwarm <hello@careerswarm.com>'
const DASHBOARD_URL = 'https://careerswarm.com/dashboard'

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY not set — skipping email send')
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getClient()
  if (!resend) return

  const firstName = name.split(' ')[0] || name

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Welcome to CareerSwarm — your Career DNA is ready',
      text: `Hi ${firstName},

Your Career DNA has been saved — you're all set.

CareerSwarm has extracted your career profile and is ready to generate ATS-optimized, tailored resumes and cover letters for any job posting you throw at it.

Here's what to do next:
1. Go to your dashboard: ${DASHBOARD_URL}
2. Paste in a job description you're excited about
3. Hit Generate — CareerSwarm will tailor your resume and cover letter in seconds

Welcome aboard,
The CareerSwarm Team
`,
    })
  } catch (err) {
    console.error('[email] sendWelcomeEmail failed:', err)
  }
}

export async function sendUpgradeConfirmationEmail(to: string, name: string): Promise<void> {
  const resend = getClient()
  if (!resend) return

  const firstName = name.split(' ')[0] || name

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "You're now on Pro — unlimited applications",
      text: `Hi ${firstName},

You're now on CareerSwarm Pro. Unlimited applications are active on your account right now.

No more limits — generate as many tailored resumes and cover letters as you need.

Head to your dashboard to get started: ${DASHBOARD_URL}

Thanks for upgrading,
The CareerSwarm Team
`,
    })
  } catch (err) {
    console.error('[email] sendUpgradeConfirmationEmail failed:', err)
  }
}
