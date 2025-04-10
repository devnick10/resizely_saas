"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MailIcon, KeyRound, EyeOff, Eye } from "lucide-react"
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'
import Header from '@/components/header'
import { useLoader } from '@/hooks/useLoader'


export default function Signin() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<unknown>()
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter()
  const { loading, setLoading } = useLoader()

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!emailAddress || !password) {
      return toast.error("Please provide both fields.")
    }

    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: emailAddress, password
      })

      if (result?.error) {
        return toast.error("Invalid email or password.")
      }

      if (result?.ok) {
        toast.success("Sign In successfully.")
        router.push('/home')
      }

    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }

  }


  if (error) {
    toast.error("Sorry for inconvenience")
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Image className='absolute bottom-0 '
        src={'/bottomwave.svg'}
        width={0}
        height={0}
        sizes='100vw'
        alt=''
        style={{ width: '100%', height: 'auto' }} />
      <div className='flex relative justify-center items-center min-w-full min-h-screen'>
        <div className='absolute top-0 bg-red-500 min-w-full'>
          <Header />
        </div>
        <div className='flex flex-col border-2 rounded-xl  py-8 px-2 border-blue-500 justify-center items-center  gap-5'>
          <div>
            <h1 className='text-xl font-bold'>Sign In</h1>
          </div>
          <form onSubmit={submit} className='flex flex-col gap-5' >

            <label className="input input-bordered flex items-center gap-2">
              <MailIcon size={20} />
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="grow"
                placeholder="Email"
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <KeyRound size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                className="w-[10.5rem]"
                value={password}
                required
              />
              {showPassword ? (
                <Eye onClick={() => setShowPassword(false)} className='cursor-pointer' size={20} />
              ) : (
                <EyeOff onClick={() => setShowPassword(true)} className='cursor-pointer' size={20} />
              )}
            </label>

            <button type='submit' className='bg-blue-600 px-4 py-2 rounded-xl '>Sign In</button>

          </form>
          <button onClick={async () => {
            await signIn("google", { callbackUrl: "/home" })
          }} className='min-w-[16rem] bg-blue-600 flex gap-2 items-center text-center justify-center px-4 py-2 rounded-xl '>
            <Image src={'/google.png'} height={23} width={23} alt='' />
            Sign In With Google
          </button>
          <p>If you don&apos;t have an account <Link className='font-bold border-b-2 mx-1' href={'/sign-up'}>Sign Up</Link></p>
        </div>
      </div>
    </>

  )
}




