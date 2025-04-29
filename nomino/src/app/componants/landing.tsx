'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
    const router = useRouter();

    const handleNavigation = () => {
        router.push('/Final_Page'); 
    };
    return (
        <div className="h-full w-full absolute bg-white overflow-hidden">
            {/* Main Content */}
            <div className="flex flex-col p-[20px] z-10 relative col-span-3 w-[1500px]">
                <nav className="fixed top-0 left-0 right-0 w-full h-[80px] flex items-center justify-between mx-auto px-10 max-w-[1200px] bg-transparent">
                    <div className="text-lg font-semibold text-black">Nomino</div>


                    <button onClick={handleNavigation} className="bg-black text-white px-6 py-2 rounded-[28px] shadow-lg hover:scale-105 transition">
                        Try now
                    </button>
                </nav>

                <div className="border border-black/[0.2] flex flex-col items-start relative w-[800px] h-[890px] p-4 shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Corner Icons */}
                    <Icon className="absolute h-6 w-6 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 text-black" />
                </div>

                <div className="relative -mt-[590px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center z-10 max-w-[600px]">
                    <h1 className="text-3xl md:text-[46px] font-extrabold mb-6 text-black">
                        Get the perfect name for your next big idea
                    </h1>
                    <p className="text-xl text-gray-700 mb-8">
                        Describe your idea or channel, and our AI will generate creative name suggestions—instantly checking if they're available for use.
                    </p>
                    <button onClick={handleNavigation} className="px-8 py-4  bg-black text-white rounded-lg shadow-md hover:scale-105 transition text-lg mt-14">
                        Try it now
                    </button>
                </div>


                <div className="border border-black/[0.2] flex flex-col items-start relative w-[665px] h-[250px] -mt-[40px] p-4 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                    {/* Corner Icons */}
                    <Icon className="absolute h-6 w-6 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 text-black" />
                </div>
                <div className="border border-black/[0.2] flex flex-col items-end absolute w-[400px] h-[250px] mt-[595px] ml-[1328px] p-4 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                    {/* Corner Icons */}
                    <Icon className="absolute h-6 w-6 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-black" />
                    <Icon className="absolute h-6 w-6 bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 text-black" />
                </div>
                {/* Testimonial Section */}
                <div className="relative -mt-[345px] ml-[510px] text-center text-black z-10 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold">antutire</h3>
                    <p className="text-gray-700 mt-2">
                        "We've seen real improvements in our sales process thanks to Nomino.
                        It's intuitive and effective!"
                    </p>

                    {/* Profile Section */}
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        <Image
                            src="/image.png"
                            alt="Founder"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="text-gray-600">Max Dalton, Founder</span>
                    </div>
                </div>
            </div>

            {/* Orange Glow Effect */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-glow"></div>
        </div>
    )
}
export default Dashboard;

export const Icon = ({ className, ...rest }: { className?: string; [key: string]: any }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );
};