"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { supabase } from "@/utils/supabase"; 

type Inputs = {
  email: string
  password: string
  passwordConfirmation: string
}

const Signup = () => {
  const { register, handleSubmit, reset, formState: { errors }, } = useForm<Inputs>(); 

  const onSubmit: SubmitHandler<Inputs> = async(inputData) => {
    const { email, password } = inputData;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/users/signin"
      },
    })

    if (error) {
      alert('登録に失敗しました');
    } else {
      alert('登録したemailに認証メールを送信しました。')
      reset();
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
      <div>
        <TextField 
          id="password-confirmation"
          label="password Confirmation"
          variant="standard"
          className="w-full"
          type="password"
          {...register("passwordConfirmation", { 
            required: "password confirmation is required" 
          })}
        />
        {errors.passwordConfirmation && <span className="text-red-500">{errors.passwordConfirmation.message}</span>}
      </div>
      <Button variant="outlined" type="submit">登録</Button>
    </form>

  </div>
  )
}

export default Signup;