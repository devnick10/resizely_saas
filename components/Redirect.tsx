import { useRouter } from 'next/navigation'
import React from 'react'

export function Redirect({ to }: { to: string }) {
    const router = useRouter()
    React.useEffect(() => {
        router.push(to)
    }, [])
    return (
        <div></div>
    )
}

