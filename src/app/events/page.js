"use client";
import Navbar from '@/components/navbar'
import EventCard from '@/components/EventCard'
import eventData from '@/data/events.json'
import { useState } from 'react'

export default function EventPage() {
    const [filter, setFilter] = useState("all");

    const filteredEvents = filter === "all"
        ? eventData
        : eventData.filter((event) => event.status === filter);

    return (
        <>
            <Navbar />
            <div className='flex flex-col h-screen p-10'>
                <div className='flex items-center gap-4 mb-10'>
                    <h1 className='text-4xl font-bold'>List of all Events</h1>
                    <div className='px-3 py-2 border-2 border-gray-300 rounded-lg '>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className='cursor-pointer'
                        >
                            <option value="all">All</option>
                            <option value="live">Live</option>
                            <option value="upcoming">Upcoming</option>
                        </select>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </>
    )
}