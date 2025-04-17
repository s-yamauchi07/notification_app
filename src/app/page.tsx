import Link from "next/link";
import { Button } from '@mui/material';

export default function Home() {
  return (
    <div className="m-10">
      <Link href="users/signup">
        <Button variant="outlined">新規登録</Button>
      </Link>
    </div>
  );
}
