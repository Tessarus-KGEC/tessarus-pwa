import useRazorpayPG from '@/hooks/useRazorpayPG';
import { useBookTicketMutation, useGetTicketByEventQuery } from '@/redux/api/ticket.slice';
import { UserSelfResponse } from '@/types/response.type';
import { Button, Chip, User } from '@nextui-org/react';
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCalendar, IoLocationSharp, IoTicketOutline } from 'react-icons/io5';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import ImageComponent from '../../components/Image';
import Ticket from '../../components/Ticket';
import { ORGANISING_CLUB_MAP } from '../../constants';
import { RoutePath } from '../../constants/route';
import { useAppSelector } from '../../redux';
import { useGetEventQuery, useGetEventsRecommendationQuery } from '../../redux/api/event.slice';
import { formateDate } from '../../utils/formateDate';
import TeamDetailsForm from './components/TeamDetailsForm';

interface ITeamMember
  extends Pick<UserSelfResponse, '_id' | 'name' | 'email' | 'phone' | 'college' | 'espektroId' | 'isFromKGEC' | 'isVolunteer' | 'profileImageUrl'> {}

const Event: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const { eventId } = useParams<{
    eventId: string;
  }>();

  const [isTeamDetailsFormVisible, setIsTeamDetailsFormVisible] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [bookedTicketId, setBookedTicketId] = useState<string>();

  const { data: eventData, isLoading } = useGetEventQuery(
    { eventId: eventId ?? '' },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: eventRecommendationData, isLoading: eventRecommendationLoading } = useGetEventsRecommendationQuery();
  const { data: eventTicket } = useGetTicketByEventQuery(
    { eventId: eventId ?? '' },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [bookTicket, { isLoading: isBookTicketLoading }] = useBookTicketMutation();

  const { handlePaymentGatewayRender, isPaymentLoading } = useRazorpayPG();

  useEffect(() => {
    if (eventTicket?.status === 200) {
      setBookedTicketId(eventTicket.data._id);
      setTeamName(eventTicket.data.team?.name ?? '');
      setTeamMembers(eventTicket.data.team?.members ?? []);
    } else {
      setTeamName('');
      setTeamMembers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTicket]);

  const isTeamCreated = useMemo(() => teamName && teamMembers.length > 0, [teamName, teamMembers]);

  const handleBookTicket = async (orderId?: string) => {
    try {
      if (!eventId) return;
      const ticketResponse = await bookTicket({
        eventId,
        orderId,
        team: {
          name: teamName,
          members: teamMembers.map((mem) => mem._id),
        },
      }).unwrap();
      console.log(ticketResponse);
      if (ticketResponse.status === 201) {
        setBookedTicketId(ticketResponse.data._id);
        toast.success('Ticket booked successfully');
      }
      return;
    } catch (error) {
      console.error(error);
      // TODO: if failed to book ticket, we should refund the payment
      toast.error('Failed to book ticket');
    }
  };

  const handleTicketPurchase = async ({
    isFromKGEC,
    eventPrice,
    eventPriceForKGEC,
    title,
  }: {
    isFromKGEC: boolean;
    eventPrice: number;
    eventPriceForKGEC: number;
    title: string;
  }) => {
    try {
      //handle payment
      await handlePaymentGatewayRender({
        amount: (isFromKGEC ? eventPriceForKGEC : eventPrice) || eventPrice,
        description: title,
        orderType: 'ticket',
        paymentSuccessCallback: async (orderId) => {
          await handleBookTicket(orderId);
        },
      });
      return;
    } catch (error) {
      toast.error('Ticket purchase failed');
      return;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!eventData) {
    return <div>Invalid Event</div>;
  }
  if (eventData.status !== 200) {
    return <div>Invalid Event</div>;
  }
  return (
    <section className="flex flex-col gap-4 overflow-x-hidden px-4 pb-6 sm:flex-row md:gap-6 md:px-6 md:pb-8">
      <article className="space-y-6 sm:flex-[2_2_0%]">
        <div>
          <ImageComponent alt={eventData.data.title} src={eventData.data.eventCoverImage} scaleRatio="md" />
        </div>
        <div className="space-y-4">
          <div className="flex gap-x-2">
            <h2 className="text-2xl font-bold">{eventData.data.title}</h2>
            <Chip
              color="default"
              variant="solid"
              className="ml-auto"
              classNames={{
                base:
                  eventData.data.eventPrice === 0 || eventData.data.eventPriceForKGEC === 0
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
                    : '',
              }}
            >
              {eventData.data.eventPrice === 0 || eventData.data.eventPriceForKGEC === 0
                ? 'Free'
                : user && user.isFromKGEC
                  ? `₹ ${eventData.data.eventPriceForKGEC}`
                  : `₹ ${eventData.data.eventPrice}`}
            </Chip>
          </div>
          <div className="space-x-2">
            <Chip color="default" variant="solid" className="ml-auto">
              {eventData.data.eventType === 'solo' ? <>Solo Event</> : <>Group Event</>}
            </Chip>
            {eventData.data.eventType === 'group' ? (
              <span className="text-sm text-default-500">
                {eventData.data.minTeamMembersSize} - {eventData.data.maxTeamMembersSize} participants
              </span>
            ) : null}
          </div>
          <p className="flex items-center gap-2 text-primary-500">
            <IoLocationSharp />
            <span>{eventData.data.eventVenue}</span>
          </p>
        </div>
        <p className="text-default-500">{eventData.data.description}</p>
        <div className="space-y-2">
          <p className="text-xl font-bold">Prizes</p>
          <p className="text-default-500">{eventData.data.prizes ?? 'No prizes mentioned'}</p>
        </div>
        <div className="space-y-3">
          <p className="text-xl font-bold">Date and Time</p>
          <p className="text-sm text-default-foreground">
            <div className="flex items-center space-x-3">
              <IoCalendar size={22} className="text-default-500" />
              <div>
                <div>From</div>
                <div className="font-semibold text-default-500">{formateDate(eventData.data.startTime)}</div>
              </div>
            </div>
            <span className="pl-2 text-lg leading-3 text-default-500">|</span>
            <div className="flex items-center space-x-3">
              <IoCalendar size={22} className="text-default-500" />
              <div>
                <div>To</div>
                <div className="font-semibold text-default-500">{formateDate(eventData.data.endTime)}</div>
              </div>
            </div>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-bold">Event Rules</p>
          <MDEditor.Markdown
            source={eventData.data.rules}
            className="!bg-transparent !text-default-500"
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-bold">Event Coordinators</p>

          <div className="flex flex-col items-start gap-y-3">
            {eventData.data.eventCoordinators.length > 0 ? (
              eventData.data.eventCoordinators.map((coord) => (
                <User
                  name={coord.name}
                  description={coord.phone}
                  avatarProps={{
                    src: coord.profileImageUrl,
                  }}
                />
              ))
            ) : (
              <div>No coordinators found</div>
            )}
          </div>
        </div>
        {isTeamCreated || bookedTicketId ? (
          <Ticket
            ticketId={bookedTicketId}
            eventName={eventData.data.title}
            eventVenue={eventData.data.eventVenue}
            eventStartDate={eventData.data.startTime}
            eventEndDate={eventData.data.endTime}
            teamName={teamName}
            teamMembers={teamMembers.map((member) => member.name)}
            isTicketBooked={!!bookedTicketId}
          />
        ) : null}

        {}

        {!isTeamCreated && !bookedTicketId ? (
          <Button
            color={'primary'}
            className="w-full text-center font-semibold md:w-[200px]"
            isDisabled={!isLoggedIn}
            onClick={async () => {
              if (!isLoggedIn || !user) {
                navigate(RoutePath.login());
                return;
              }
              setIsTeamDetailsFormVisible(true);
            }}
          >
            Register
          </Button>
        ) : null}

        {/* {bookedTicketId ? (
          <Button color={'default'} className="w-full text-center font-semibold md:w-[200px]">
            View Ticket
          </Button>
        ) : null} */}

        <div className="flex flex-wrap gap-4">
          {isTeamCreated && !bookedTicketId ? (
            <Button
              color={'default'}
              className="w-full max-w-[300px] flex-1 text-center font-semibold"
              onClick={async () => {
                setIsTeamDetailsFormVisible(true);
              }}
            >
              <MdOutlineModeEditOutline size={20} />
              Edit team
            </Button>
          ) : null}

          {isTeamCreated && !bookedTicketId ? (
            <Button
              isLoading={isBookTicketLoading || isPaymentLoading}
              color="primary"
              className="w-full max-w-[300px] flex-1 text-center"
              onPress={async () => {
                const isFreeEvent = eventData.data.eventPrice === 0 || eventData.data.eventPriceForKGEC === 0;
                if (isFreeEvent) await handleBookTicket();
                else
                  await handleTicketPurchase({
                    isFromKGEC: user?.isFromKGEC ?? false,
                    eventPrice: eventData.data.eventPrice,
                    eventPriceForKGEC: eventData.data.eventPriceForKGEC ?? 0,
                    title: eventData.data.title,
                  });
              }}
            >
              <IoTicketOutline size={20} />
              Book Ticket
            </Button>
          ) : null}
        </div>
      </article>
      <article className="w-full sm:max-w-[300px]">
        <h2 className="text-xl font-semibold">Recommanded events</h2>
        <>
          {eventRecommendationLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {eventRecommendationData?.status === 200 && eventRecommendationData.data.events.length > 0 ? (
                <ul className="space-y-6">
                  {eventRecommendationData.data.events.map((event) => (
                    <li className="">
                      <div
                        className="h-full cursor-pointer gap-4 space-y-2"
                        onClick={() => {
                          navigate(RoutePath.event(event._id));
                        }}
                      >
                        <ImageComponent alt={event.title} src={event.eventThumbnailImage} />
                        <div className="flex gap-x-2">
                          <h2 className="text-lg font-semibold">{event.title}</h2>
                          <Chip
                            color="default"
                            variant="solid"
                            className="ml-auto"
                            size="sm"
                            classNames={{
                              base:
                                event.eventPrice === 0 || event.eventPriceForKGEC === 0
                                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
                                  : '',
                            }}
                          >
                            {event.eventPrice === 0 || event.eventPriceForKGEC === 0
                              ? 'Free'
                              : user && user.isFromKGEC
                                ? `₹ ${event.eventPriceForKGEC}`
                                : `₹ ${event.eventPrice}`}
                          </Chip>
                        </div>
                        <p className="text-sm text-default-500">
                          {event.description.length > 80 ? `${event.description.slice(0, 80)}...` : event.description}
                        </p>
                        <p className="space-x-2 text-sm">
                          <span className="text-default-500">by</span>
                          <span className="font-semibold">{ORGANISING_CLUB_MAP[event.eventOrganiserClub]}</span>
                        </p>
                        <div className="space-x-2">
                          <Chip color="default" variant="solid" className="ml-auto" size="sm">
                            {event.eventType === 'solo' ? <>Solo Event</> : <>Group Event</>}
                          </Chip>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No events found</div>
              )}
            </div>
          )}
        </>
      </article>

      <TeamDetailsForm
        isOpen={isTeamDetailsFormVisible}
        onClose={() => {
          setIsTeamDetailsFormVisible(false);
        }}
        minTeamSize={eventData.data.minTeamMembersSize ?? 1}
        maxTeamSize={eventData.data.maxTeamMembersSize ?? 1}
        teamName={teamName}
        teamMembers={teamMembers}
        setTeam={([teamName, teamMembers]) => {
          setTeamName(teamName);
          setTeamMembers(teamMembers);
        }}
      />
    </section>
  );
};

export default Event;
