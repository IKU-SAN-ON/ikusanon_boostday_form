import { forbidden } from "next/navigation";

export default async function Error403() {
  forbidden();
}
