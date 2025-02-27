"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import Videos from '@/components/Videos';

function VideoUpload() {

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const router = useRouter();

  const MAX_FILE_SIZE = 100 * 1024 * 1024;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size to large");
      return
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {

      const response = await axios.post("/api/video-upload", formData)
      if (response.status !== 200) {
        toast.error("failed to upload video")
        return
      }
      console.log(response);
      

      toast.success("Video uploaded.");
      router.push('/home')
    } catch (error) {

      console.log(error);
      toast.error("failed to upload video")

    } finally {
      setIsUploading(false)
    }



  }


  return (
    <div className='container  mx-auto p-4 max-w-4xl'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <p className='text-center font-semibold'>Video Compression Service – Currently for Videos up to 70MB (More Coming Soon!)🚀. </p>
      <div>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='label'>
              <span className='label-text'>Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='input input-bordered w-full'
              required
            />
          </div>
          <div>
            <label className='label'>
              <span className='label-text'>Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='textarea textarea-bordered w-full'
            />

          </div>
          <div>
            <label className='label'>
              <span className='label-text'>Video File</span>
            </label>
            <input
              type="file"
              accept='vieo/*'
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className='file-input file-input-bordered w-full'
              required
            />

          </div>
          <button
          type='submit'
          className='btn btn-primary'
          disabled={isUploading}
          >
           {isUploading?"Uploading..":"Upload Video"}
          </button>
        </form>
      </div>
         <Videos/>
    </div>
  )
}

export default VideoUpload