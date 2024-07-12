"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Custom404() {
  useEffect(() => {
    redirect("/map.html");
  });

  return null;
}
