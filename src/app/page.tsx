"use client"

import Link from "next/link";
import { Button } from '@mui/material';

export default function Home() {
  return (
    <div className="m-10 flex flex-col gap-4">
      <Link href="users/signup">
        <Button variant="outlined">新規登録</Button>
      </Link>
      <Link href="users/signin">
        <Button variant="outlined">ログイン</Button>
      </Link>
    </div>
  );
}
