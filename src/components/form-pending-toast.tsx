'use client';

import {useEffect} from 'react';
import {useFormStatus} from 'react-dom';
import {toast} from 'sonner';

/**
 * แสดง sonner loading ขณะ server action ยัง pending
 * ใช้ id เดียวกับ toast ผลลัพธ์ เพื่อให้ success/error มาแทนที่ loading โดยไม่ซ้อนกัน
 * ต้องวางไว้ข้างใน <form> เท่านั้น เพราะใช้ useFormStatus
 */
export function FormPendingToast({message, toastId}: {message: string; toastId: string}) {
  const {pending} = useFormStatus();

  useEffect(() => {
    if (!pending) return;
    toast.loading(message, {id: toastId});
    return () => {
      toast.dismiss(toastId);
    };
  }, [pending, message, toastId]);

  return null;
}
