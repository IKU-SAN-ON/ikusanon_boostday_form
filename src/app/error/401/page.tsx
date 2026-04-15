import { unauthorized } from "next/navigation";

export default async function Error401() {
  unauthorized();
}
