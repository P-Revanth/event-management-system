"use client";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import eventData from "@/data/events.json";
import EventCard from "@/components/EventCard";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("live");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const catchPhrases = [
    "Experience the extraordinary, together.",
    "Where memories are made, dreams are born.",
    "Live your best moments.",
    "Creating unforgettable experiences.",
    "Your next adventure awaits."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % catchPhrases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = eventData.filter((event) => event.status === activeTab);

  return (
    <>
      <Navbar />
      <div className="flex w-screen flex-col gap-10 items-center justify-center">
        <div className="flex w-full items-center justify-between px-20 mt-10">
          <div className="flex h-2 w-20 text-lg">
            Mission Statement
          </div>
          <div className="flex flex-col text-center">
            <h1 className="text-9xl font-bold">Discover</h1>
            <h1 className="text-9xl font-bold">Events</h1>
          </div>
          <div className="flex h-2 w-30 text-lg">
            Search Event by name
          </div>
        </div>
        <div className="flex items-center justify-between p-10 w-fit gap-30">
          <div className="flex w-96 text-2xl text-center">
            Discover a wide range of events happening around you.
          </div>
          <div className="flex">
            <Image
              src="/images/globe.svg"
              alt="Search Bar"
              width={70}
              height={70}
            />
          </div>
          <div className="flex w-96 text-2xl text-center">
            Discover a wide range of events happening around you.
          </div>
        </div>
        <div className="flex items-center h-fit w-full justify-center space-x-5">
          <Image
            src="/images/dj.jpg"
            alt="image1"
            width={400}
            height={200}
            className="cursor-pointer h-fit w-fit rounded-3xl"
          />
          <Image
            src="/images/mascot.jpeg"
            alt="mascot"
            width={150}
            height={40}
            className="cursor-pointer rounded-full"
          />
          <Image
            src="/images/music.jpg"
            alt="music"
            width={400}
            height={200}
            className="cursor-pointer rounded-3xl h-fit w-fit"
          />
          <Image
            src="/images/crowd.jpg"
            alt="crowd"
            width={350}
            height={200}
            className="cursor-pointer rounded-full h-fit w-fit"
          />
        </div>
      </div>
      <div className="flex flex-col w-full h-fit bg-black mt-20 items-center justify-center">
        <div className="flex w-full h-fit items-center justify-between pl-10 pr-20">
          <p className="text-white text-4xl">Explore Events</p>
          <div className="flex h-fit w-fit items-center gap-10">
            <p
              onClick={() => setActiveTab("live")}
              className={`text-xl border-2 border-white rounded-full px-10 py-1 cursor-pointer ${activeTab === "live" ? "bg-white text-black!" : "text-white"}`}
            >
              Live
            </p>
            <p
              onClick={() => setActiveTab("upcoming")}
              className={`text-xl border-2 border-white rounded-full px-10 py-1 cursor-pointer ${activeTab === "upcoming" ? "bg-white text-black!" : "text-white"}`}
            >
              Upcoming
            </p>
            <Link href="/events">
              <Image
                src="/images/explore.svg"
                alt="explore"
                width={50}
                height={50}
                className="cursor-pointer hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
        <div className="flex w-full items-center justify-center px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-fit px-10 py-10">
        <h1 className="text-4xl font-bold mb-10">Gallery / Past Events</h1>
        <div className="grid grid-cols-4 grid-rows-3 gap-5 w-full h-[900px]">
          <div className="col-span-1 row-span-2 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/event-6.jpg"
              alt="gallery1"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/event-1.jpg"
              alt="gallery2"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="col-span-2 row-span-1 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/crowd.jpg"
              alt="gallery3"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/event-2.png"
              alt="gallery4"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/event-5.jpg"
              alt="gallery5"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/event-4.webp"
              alt="gallery6"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src="/images/event-3.png"
              alt="gallery7"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-fit px-10 py-10">
        <h1 className="text-4xl font-bold mb-16">Frequently Asked Questions</h1>
        <div className="flex flex-col w-full gap-10">
          <div className="flex gap-3 items-start">
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-3xl font-bold">Ticketing</h3>
              <p className="text-xl text-gray-700">
                Tickets can be purchased online through our platform. Once you book a ticket, you will receive a confirmation email with your ticket details and QR code. Please present this QR code at the venue entrance for quick check-in.
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-3xl font-bold">Refunds</h3>
              <p className="text-xl text-gray-700">
                Refund requests must be made at least 48 hours before the event start time. Full refunds will be processed within 7-10 business days. Cancellations made within 48 hours of the event are not eligible for refunds.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-3xl font-bold">Entry Requirements</h3>
              <p className="text-xl text-gray-700">
                All attendees must present a valid ticket (digital or printed) and a government-issued ID at the entrance. Please arrive at least 30 minutes before the event start time to avoid queues.
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-3xl font-bold">Age Limits</h3>
              <p className="text-xl text-gray-700">
                Age restrictions vary by event. Most events are open to all ages, but some may have a minimum age requirement of 18+. Please check the specific event details before booking. Children under 12 must be accompanied by an adult.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-3xl font-bold">Venue Details</h3>
              <p className="text-xl text-gray-700">
                Venue locations and maps are provided in each event's detail page. Most venues offer parking facilities, wheelchair accessibility, and food & beverage services. For specific venue inquiries, please contact the venue directly.
              </p>
            </div>
            <div className="flex flex-1"></div>
          </div>
        </div>
      </div>

      <footer className="flex flex-col w-full h-fit bg-black text-white py-10 px-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Stay Connected.!</h2>
            <p className="text-xl italic transition-opacity duration-500">{catchPhrases[currentPhraseIndex]}</p>
          </div>
          <div className="flex gap-6">
            <Link href="https://facebook.com" target="_blank" className="hover:scale-110 transition-transform duration-300">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-black text-2xl font-bold">f</span>
              </div>
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:scale-110 transition-transform duration-300">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-black text-2xl font-bold">𝕏</span>
              </div>
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:scale-110 transition-transform duration-300">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-black text-2xl font-bold">📷</span>
              </div>
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:scale-110 transition-transform duration-300">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-black text-2xl font-bold">in</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-white border-opacity-20">
          <p className="text-lg">© 2025 Event Management. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-lg hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-lg hover:underline">Terms of Service</Link>
            <Link href="/contact" className="text-lg hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </>
  );
}