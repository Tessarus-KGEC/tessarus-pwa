import { Button } from '@nextui-org/button';
import { cn, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup, useRadio, VisuallyHidden } from '@nextui-org/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { PaymentMethod, PaymentMethodMap } from '../../../constants';
import useRazorpayPG from '../../../hooks/useRazorpayPG';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { useBookTicketMutation } from '../../../redux/api/ticket.slice';
import { useDeductWalletAmountMutation } from '../../../redux/api/wallet.slice';
import { setCurrentUserWalletBalance } from '../../../redux/reducers/auth.reducer';
import { getAPIErrorMessage } from '../../../utils/api.helper';
import { ITeamMember } from '../Event';

interface IProps {
  isOpen: boolean;
  defaultPaymentMethod: PaymentMethod;
  onClose: () => void;
  eventTitle: string;
  eventId: string;
  teamName: string;
  teamMembers: ITeamMember[];
  isFreeEvent: boolean;
  eventPrice: number;
  onTicketBooked: (ticketId: string) => void;
}
const PaymentSelectionModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  defaultPaymentMethod = PaymentMethodMap.WALLET,
  eventId,
  eventTitle,
  teamName,
  teamMembers,
  onTicketBooked,
  isFreeEvent,
  eventPrice,
}) => {
  console.log('🚀 ~ defaultPaymentMethod:', defaultPaymentMethod);
  const { walletBalance } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [selectedPaymentMethod, setSetselectedPaymentMethod] = useState(defaultPaymentMethod);

  const [bookTicket, { isLoading: isBookTicketLoading }] = useBookTicketMutation();

  const { handlePaymentGatewayRender, isPaymentLoading } = useRazorpayPG();

  const [handleDeductWalletBalance, { isLoading: isDeductWalletBalanceLoading }] = useDeductWalletAmountMutation();

  const handleBookTicket = async (transactionId?: string) => {
    try {
      const ticketResponse = await bookTicket({
        eventId,
        transactionId,
        team: {
          name: teamName,
          members: teamMembers.map((mem) => mem._id),
        },
      }).unwrap();
      console.log(ticketResponse);
      if (ticketResponse.status === 201) {
        onTicketBooked(ticketResponse.data._id);
        onClose();
        toast.success('Ticket booked successfully');
      }
      return;
    } catch (error) {
      console.error(error);
      // TODO: if failed to book ticket, we should refund the payment
      toast.error(getAPIErrorMessage(error));
    }
  };

  const handleTicketPurchase = async ({ eventPrice, title }: { eventPrice: number; title: string }) => {
    try {
      //handle payment
      await handlePaymentGatewayRender({
        eventId,
        amount: eventPrice,
        description: title,
        orderType: 'ticket',
        paymentSuccessCallback: async (transactionId) => {
          await handleBookTicket(transactionId);
        },
      });
      return;
    } catch (error) {
      toast.error('Ticket purchase failed');
      return;
    }
  };

  const handleTicketPurchaseWithWallet = async ({ eventPrice, eventId }: { eventPrice: number; eventId: string }) => {
    try {
      const deductWalletResponse = await handleDeductWalletBalance({
        amount: eventPrice,
        eventId,
      }).unwrap();
      if (deductWalletResponse.status === 200) {
        await handleBookTicket(deductWalletResponse.data.transaction);
        dispatch(setCurrentUserWalletBalance(deductWalletResponse.data.amount));
      }
    } catch (error) {
      toast.error(getAPIErrorMessage(error));
    }
  };

  return (
    <Modal
      backdrop={'opaque'}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      className="bg-default-50 text-default-foreground dark"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Select payment method</ModalHeader>
            <ModalBody>
              <RadioGroup
                defaultValue={defaultPaymentMethod}
                onChange={(e) => {
                  setSetselectedPaymentMethod(e.target.value as PaymentMethod);
                }}
              >
                <PaymentCustomRadio value={PaymentMethodMap.WALLET} description={`Pay using your wallet`}>
                  Wallet <br />
                  (Available Balance: ₹ {walletBalance})
                </PaymentCustomRadio>
                <PaymentCustomRadio value={PaymentMethodMap.RAZORPAY} description="Pay using UPI, bank account and others">
                  Direct Payment
                </PaymentCustomRadio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isBookTicketLoading || isPaymentLoading || isDeductWalletBalanceLoading}
                onPress={async () => {
                  if (isFreeEvent) await handleBookTicket();
                  else if (selectedPaymentMethod === PaymentMethodMap.WALLET) {
                    await handleTicketPurchaseWithWallet({
                      eventPrice,
                      eventId,
                    });
                  } else {
                    await handleTicketPurchase({
                      eventPrice: eventPrice,
                      title: eventTitle,
                    });
                  }
                }}
              >
                Continue
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PaymentCustomRadio: React.FC<any> = (props) => {
  const { Component, children, description, getBaseProps, getWrapperProps, getInputProps, getLabelWrapperProps, getControlProps } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group inline-flex flex-row-reverse items-center justify-between tap-highlight-transparent',
        'cursor-pointer gap-4 rounded-2xl border-2 border-default px-3 py-4 text-default-400',
        'data-[selected=true]:border-primary',
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span className="font-bold group-data-[selected=true]:text-foreground">{children}</span>}
        {description && <span className="text-small group-data-[selected=true]:text-foreground-500">{description}</span>}
      </div>
    </Component>
  );
};

export default PaymentSelectionModal;
