import { toast } from "sonner";

export const handleReqWithToaster = async (
  toastTitle: string,
  fn: () => Promise<void>
) => {
  const tID = toast.loading(toastTitle);
  try {
    await fn();
  } catch (error) {}
  toast.dismiss(tID);
};
