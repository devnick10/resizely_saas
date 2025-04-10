"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MailIcon, KeyRound, User2, EyeOff, Eye } from "lucide-react"
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'
import Header from '@/components/header'
import { useLoader } from '@/hooks/useLoader'
import { sendOTP } from '@/actions/sendOtp'
import { verifyOtp } from '@/actions/verifyOtp'


export default function Signup() {

  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState('')
  const [error, setError] = useState<unknown>()
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter()
  const { loading, setLoading } = useLoader()

  if (loading) return <Loader />

  async function submit(e: FormEvent) {
    e.preventDefault()

    try {

      if (!emailAddress || !password || !username) {
        return toast.error("Please provied all fields.")
      }

      setLoading(true)
      await signIn("credentials", {
        email: emailAddress,
        username,
        password
      })

      await sendOTP(emailAddress)

      setVerification(true)
    } catch (error) {
      setError(error)
      toast.error(error);

    } finally {
      setLoading(true)
    }
  }

  //    verify email verification code
  async function onPressVerify(e: FormEvent) {
    e.preventDefault()

    if (!loading) {
      return <Loader />
    }

    try {
      setLoading(true)
      const verified = await verifyOtp(emailAddress, code)

      if (!verified) {
        return toast.error("Envalid verification code")
      }

      if (verified) {
        toast.success("verify successfully.")
        router.push('/social-share')
      }

    } catch (error) {
      toast.error("Signup failed try again.");
      setError(error);
    } finally {
      setLoading(true)
    }
  }

  if (error) {
    toast.error("Sorry for inconvenience")
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
        {error ? <div>Enternal Servar Error</div> : <><div className='flex  flex-col border-2 rounded-xl p-4 border-blue-500 justify-center items-center gap-5'>
          <div>
            <h1 className='font-bold text-xl'>Sign Up</h1>
          </div>
          {!verification ? (
            <>
              <form className='flex flex-col gap-5' onSubmit={submit}>
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
                <button type='submit' className='bg-blue-600 px-4 py-2 rounded-xl '>Sign Up</button>
              </form>
              <button onClick={() => {
                signIn('google', { callbackUrl: "/home" })
              }} className='w-full bg-blue-600 flex gap-2 items-center text-center justify-center px-4 py-2 rounded-xl '>
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

        </div></>}
      </div>
    </>
  );
}





