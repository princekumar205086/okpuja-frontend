import axios from "axios";

// fetching booking details

export async function fetchBookingDetails(userId: number, cartId: string) {
  try {
    const response = await axios.get(
      `/api/pujabookingdetails?userId=${userId}&cartId=${cartId}`
    );
    return response.data;
  } catch (error) {
    const err = error as { response?: { data?: { error?: string } } };
    return err;
  }
}
