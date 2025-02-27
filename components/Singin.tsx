"use client"
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MailIcon, KeyRound, EyeOff, Eye } from "lucide-react"
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'
import { OAuthStrategy } from '@clerk/types';
import Header from '@/components/header'


export default function Signin() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [cError, setCerror] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const { isLoaded, setActive, signIn } = useSignIn()

  const router = useRouter()

  if (!isLoaded) {
    return <Loader />
  }


  async function submit(e: FormEvent) {
    e.preventDefault();

    if (emailAddress.length >= 0 || password.length >= 0) {
      return toast.error("Please provide both fields.")
    }


    try {

      const result = await signIn?.create({
        identifier: emailAddress, password
      })

      if (!result || result.status !== "complete") {
        return toast.error("Invalid email or password.")
      }

      if (result.status === "complete" && setActive) {
        await setActive({ session: result.createdSessionId })
        router.push('/home')
      }

    } catch (error: any) {
      setCerror(error.errors[0].message)
    }





  }


  // signup provider 
  const signUpWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sign-in/sso-callback',
      redirectUrlComplete: '/home',
    })
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
          {cError && <div><h2>{cError}</h2></div>}
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
          <button onClick={() => signUpWith('oauth_google')} className='min-w-[16rem] bg-blue-600 flex gap-2 items-center text-center justify-center px-4 py-2 rounded-xl '>
            <Image src={'/google.png'} height={23} width={23} alt='' />
            Sign In With Google
          </button>
          <p>If you don&apos;t have an account <Link className='font-bold border-b-2 mx-1' href={'/sign-up'}>Sign Up</Link></p>
        </div>
      </div>

    </>

  )
}




