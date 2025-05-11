"use client";

import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

const ButtonBack = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Button
      variant="solid"
      color="danger"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  )
}

export default ButtonBack