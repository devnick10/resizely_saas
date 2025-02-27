"use client"
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { OAuthStrategy } from '@clerk/types'
import Link from 'next/link'
import { MailIcon, KeyRound, User2, EyeOff, Eye } from "lucide-react"
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'
import axios from 'axios'
import Header from '@/components/header'


export default function Signup() {

  const { isLoaded, signUp, setActive } = useSignUp()

  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter()



  if (!isLoaded) return <Loader />

  async function submit(e: FormEvent) {
    e.preventDefault()

    try {

      if (!emailAddress || !password || !username) {
        return toast.error("Please provied all fields.")
      }

      // create user

      await signUp?.create({
        emailAddress: emailAddress,
        password

      })


      // send verification code
      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code'
      })

      setVerification(true)

    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message)
      toast.error(error);

    }
  }

  //    verify email verification code
  async function onPressVerify(e: FormEvent) {
    e.preventDefault()

    if (!isLoaded) {
      return <Loader />
    }

    try {

      const completeSignup = await signUp.attemptEmailAddressVerification({ code })

      if (completeSignup.status !== "complete") {
        return toast.error("Envalid verification code")
      }

      if (completeSignup.status === "complete") {

        const response = await axios.post('/api/users', { username, emailAddress }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.status !== 200) {
          throw new Error("Signup failed")
        }

        await setActive({ session: completeSignup.createdSessionId })
        toast.success("verify successfully.")

        router.push('/social-share')
      }

    } catch (error: any) {
      toast.error("Signup failed try again.");
      setError(error.errors[0].message);

      console.log(JSON.stringify(error, null, 2));
    }


  }

  // signup provider 
  const signUpWith = (strategy: OAuthStrategy) => {
    return signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sign-up/sso-callback',
      redirectUrlComplete: '/home',
    })
  }


  return (
    <>
      <Image
        className='absolute bottom-0 '
        src={'/bottomwave.svg'}
        width={0}
        height={0}
        sizes='100vw'
        alt=''
        style={{ width: '100%', height: 'auto' }}
      />
      <div className='relative flex justify-center  items-center min-w-full min-h-screen'>
        <div className='absolute top-0 bg-red-500 min-w-full'>
          <Header />
        </div>
        <div className='flex  flex-col border-2 rounded-xl p-4 border-blue-500 justify-center items-center gap-5'>
          <div>
            <h1 className='font-bold text-xl'>Sign Up</h1>
          </div>
          {!verification ? (
            <>
              <form className='flex flex-col gap-5' onSubmit={submit}>
                {error && <div><h2>{error}</h2></div>}
                <label className="input input-bordered flex items-center gap-2">
                  <MailIcon size={20} />
                  <input type="text" onChange={(e) => setEmailAddress(e.target.value)} className="grow" value={emailAddress} placeholder="Email" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <User2 size={20} />
                  <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className="grow" placeholder="Username" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <KeyRound size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[10.5rem]"
                    value={password}
                  />
                  {showPassword ? (
                    <EyeOff onClick={() => setShowPassword(false)} className='cursor-pointer' size={20} />
                  ) : (
                    <Eye onClick={() => setShowPassword(true)} className='cursor-pointer' size={20} />
                  )}
                </label>
                {/* CAPTCHA Widget */}
                <div id="clerk-captcha"></div>
                <button type='submit' className='bg-blue-600 px-4 py-2 rounded-xl '>Sign Up</button>
                
              </form>
              <button onClick={() => signUpWith('oauth_google')} className='w-full bg-blue-600 flex gap-2 items-center text-center justify-center px-4 py-2 rounded-xl '>
                <Image src={'/google.png'} height={23} width={23} alt='' />
                Sign Up With Google
              </button>
              <p>Already have an account <Link className='font-bold border-b-2 mx-1' href={'/sign-in'}>Sign In</Link></p> </>
          ) : (

            <form className='flex flex-col gap-5' onSubmit={onPressVerify}>
              <h1 className='text-center'>Enter email verification code</h1>
              <label className="input input-bordered flex items-center gap-2">

                <input onChange={(e) => setCode(e.target.value)} value={code} type="text" className="grow" placeholder="code" />
              </label>

              <button type='submit' className='bg-blue-600 px-4 py-2 rounded-xl '>continue</button>
            </form>
          )
          }

        </div>
      </div>
    </>
  );
}





