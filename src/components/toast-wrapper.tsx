"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastContainerWrapper() {
  return (
    <ToastContainer
      closeButton={false}
      limit={5}
      icon={false}
      autoClose={2000}
    />
  );
}
