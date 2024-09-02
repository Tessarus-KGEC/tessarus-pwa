/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function renderRazorpayPG({
  amount,
  orderType,
  description,
  token,
  paymentSuccessCallback,
}: {
  amount: number;
  orderType: 'ticket' | 'wallet';
  description: string;
  token: string;
  paymentSuccessCallback: () => Promise<void>;
}) {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  if (!res) {
    alert('Razropay failed to load!!');
    return;
  }

  try {
    const orderData = await axios.post<{
      data: {
        orderId: string;
        amount: number;
      };
    }>(
      `${import.meta.env.VITE_API_URL}/payment/create-payment`,
      {
        amount,
        orderType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const options = {
      key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
      amount: `${amount * 100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: 'INR',
      name: 'Tessarus KGEC',
      description,
      //   image: 'https://res.cloudinary.com/dvgapxbzj/image/upload/v1724550854/tessarus-25/xnyvvlkmx2r4axb7ptvx.png',
      order_id: orderData.data.data.orderId,
      theme: {
        color: '#554ccc',
      },
      handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
        if (response.razorpay_payment_id) await paymentSuccessCallback();
      },
      //   prefill: {
      //     name: 'Gaurav Kumar',
      //     email: 'gaurav.kumar@example.com',
      //     contact: '9000090000',
      //   },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
      return;
    }
    toast.error('Failed to create order');
  }
}
