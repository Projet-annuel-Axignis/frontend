"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const ButtonBack = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  )
}

export default ButtonBack