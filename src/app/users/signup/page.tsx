"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

type Inputs = {
  email: string
  password: string
  passwordConfirmation: string
}

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
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