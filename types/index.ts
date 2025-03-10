export interface Video {
    id: number
    title: string
    description?: string | null
    publicId: string
    originalSize: string
    compressSize: string
    duration: number
    createdAt: Date
    updatedAt: Date
    userId:string
}