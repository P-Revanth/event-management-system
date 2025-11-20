import Image from "next/image";
import Link from "next/link";

export default function EventCard({ event }) {
    return (
        <Link href={`/events/${event.id}`}>
            <div className="flex flex-col w-[500px] p-4 bg-linear-to-br from-green-400 to-green-500 rounded-3xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-black bg-opacity-20 p-3 rounded-2xl">
                        <Image
                            src="/images/globe.svg"
                            alt="event icon"
                            width={32}
                            height={32}
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-2">{event.title}</h3>

                <div className="flex flex-col gap-1 mb-2">
                    <div className="flex items-start justify-between">
                        <span className="text-black text-lg">Location:</span>
                        <p className="text-black text-lg mr-10">Date:</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-black text-md font-bold">{event.location}</span>
                        </div>
                        <div className="text-black">
                            <span className="text-md font-bold">{event.date}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black border-opacity-20">
                    <span className="text-black text-xl font-semibold">Price</span>
                    <button className="bg-black text-white px-8 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors">
                        <span className="font-semibold">₹{event.price}</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}
