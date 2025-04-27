import dynamic from 'next/dynamic'

const SignIn = dynamic(() => import('@/components/SignInPage'), {
  ssr: false, // Disable server-side rendering
  loading: () => <p>Loading...</p>
})

export default function Page() {
  return <SignIn />
}