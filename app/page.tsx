import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the default tenant login
  redirect('/t/tebca/auth/login')
}
