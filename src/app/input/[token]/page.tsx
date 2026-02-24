'use server';

import InputPageClientSide from "./InputPageClientSide";

import { validateRequestSchema } from "@/lib/definitions";

import getUserDates from "@/services/userdata/getUserDates";
import { InvalidTokenError } from "@/lib/errors";

import { forbidden, unauthorized } from "next/navigation";

const InputPageServerWrapper = async ({params} : {params: Promise<{token: string}>}) => {
  const { token } = await params;
  try {
    validateRequestSchema.parse({ token });
  } catch (error) {
    console.error('Invalid token format:', error);
    unauthorized();
  }

  try {
    const selectedDates = await getUserDates(token);

    return (<InputPageClientSide token={token} previousData={selectedDates}/>);
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      console.warn('InputPageServerWrapper: Invalid token:', error);
      forbidden();
    }
    console.error('Error in InputPageServerWrapper:', error);
    throw error;
  }
}

export default InputPageServerWrapper;