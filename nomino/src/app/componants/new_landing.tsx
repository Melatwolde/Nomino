'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    const handleNavigation = () => {
        router.push('/Final_Page'); 
    };
    return(
        <div className="h-full w-full absolute bg-white overflow-hidden">  
            <div className='flex flex-1 justify-center items-center  z-10 relative '>
                <nav className="fixed top-0 left-0 right-0 w-full h-[80px] flex items-center justify-between mx-auto px-10 max-w-[1200px] bg-transparent">
                        <div className="text-lg font-semibold text-black">Nomino</div>
                        <button onClick={handleNavigation} className="bg-black text-white px-6 py-2 rounded-[28px] shadow-lg hover:scale-105 transition">Try now</button>
                </nav>

                <div className="relative w-full max-w-3xl h-[60vh] -mt-4 border border-black/20 shadow-lg p-4">
                    <Icon className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-black h-6 w-6" />
                    <Icon className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-black h-6 w-6" />
                    <Icon className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-black h-6 w-6" />
                    <Icon className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-black h-6 w-6" />
                </div>

                <div className="fixed justify-center top-12 items-center h-screen text-center text-black z-10">
                    <div className="max-w-[600px] p-4">
                        <h1 className="text-3xl md:text-[46px] font-extrabold mb-6 text-black">
                        Get the perfect name for your next big idea
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                        Describe your idea or channel, and our AI will generate creative name suggestions—instantly checking if they're available for use.
                        </p>
                        <button
                        onClick={handleNavigation}
                        className="px-8 py-4 bg-black text-white rounded-lg shadow-md hover:scale-105 transition text-lg mt-14"
                        >
                        Try it now
                        </button>
                    </div>
                </div>
                <div className="fixed bottom-0 left-0">
                    <div className="w-[400px] h-[180px] sm:w-[300px] sm:h-[200px] md:w-[385px] md:h-[250px] bg-white border border-black/20 shadow-lg rounded-md relative">
                        {/* Corner Icons */}
                        <Icon className="absolute h-6 w-6 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 text-black" />
                        <Icon className="absolute h-6 w-6 bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 text-black" />
                        <Icon className="absolute h-6 w-6 top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-black" />
                        <Icon className="absolute h-6 w-6 bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 text-black" />
                    </div>
                </div>

                <div className="fixed bottom-0 right-0"> 
                    <div className="w-[400px] h-[180px] sm:w-[300px] sm:h-[200px] md:w-[385px] md:h-[250px] bg-white border border-black/20 shadow-lg rounded-md relative">
                            <Icon className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-black h-6 w-6" />
                            <Icon className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-black h-6 w-6" />
                            <Icon className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-black h-6 w-6" />
                            <Icon className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-black h-6 w-6" />
                    </div>
                </div>
                
               
                <div className="absolute -bottom-[260px] left-1/2 transform -translate-x-1/2 text-center text-black z-10">
                    <div className="max-w-md p-4">
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
            </div>
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