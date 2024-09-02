/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCreatePaymentOrderMutation } from '@/redux/api/payment.slice';
import { CreatePaymentOrderArgs } from '@/types/args.type';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
declare global {
  interface Window {
    Razorpay: any;
  }
}
const useRazorpayPG = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [createOrder] = useCreatePaymentOrderMutation();
  /**
   * For loading the Razorpay script, UI
   */
  useEffect(() => {
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
    (async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        alert('Razropay failed to load!!');
        return;
      }
    })();
  }, []);

  /** handle payment callback */
  const handlePaymentGatewayRender = useCallback(
    async (
      args: CreatePaymentOrderArgs & {
        description: string;
        paymentSuccessCallback: (orderId: string) => Promise<void>;
      },
    ) => {
      setIsPaymentLoading(true);
      const orderData = await createOrder({
        amount: args.amount,
        orderType: args.orderType,
      }).unwrap();

      if (orderData.status !== 201) {
        toast.error('Failed to create payment order');
        return;
      }

      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: `${args.amount * 100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Tessarus KGEC',
        description: args.description,
        //   image: 'https://res.cloudinary.com/dvgapxbzj/image/upload/v1724550854/tessarus-25/xnyvvlkmx2r4axb7ptvx.png',
        order_id: orderData.data.razorpayOrderId,
        theme: {
          color: '#554ccc',
        },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          if (response.razorpay_payment_id) await args.paymentSuccessCallback(orderData.data.order._id);
          setIsPaymentLoading(false);
        },
      };
      console.log(options);
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    },
    [createOrder],
  );
  return { handlePaymentGatewayRender, isPaymentLoading };
};

export default useRazorpayPG;
