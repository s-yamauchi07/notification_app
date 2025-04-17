"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { supabase } from "@/utils/supabase"; 
import { useRouter } from "next/navigation";

type Inputs = {
  email: string
  password: string
}

const Signin = () => {
  const { register, handleSubmit, reset, formState: { errors }, } = useForm<Inputs>(); 
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async(inputData) => {
    const { email, password } = inputData;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert('ログインに失敗しました');
    } else {
      alert('ログインしました');
      reset();
      router.push("/home");
    }
  }

  return (
  <div className="w-96 py-10 m-auto"> 
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <TextField 
          id="email"
          label="email"
          variant="standard"
          className="w-full"
          {...register("email", { 
            required: "email is required" 
          })}
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>
      <div>
        <TextField 
          id="password"
          label="password"
          variant="standard"
          className="w-full"
          type="password"
          {...register("password", { 
            required: "password is required"
          })}
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>
      <Button variant="outlined" type="submit">ログイン</Button>
    </form>

  </div>
  )
}

export default Signin;