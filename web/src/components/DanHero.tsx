import Image from "next/image";

export default function DanHero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center md:justify-start">
          <Image src="/brand/dan.png" alt="Dan the Wasatch Sasquatch" width={360} height={520} />
        </div>
        <div>
          <h2 className="text-white text-2xl sm:text-3xl font-bold">Meet Dan, Your Utah Adventure Guide</h2>
          <p className="text-white/80 italic mt-3">“Wander Wisely, Travel Kindly, and Stay Curious!”</p>
          <p className="text-white/70 mt-2">—Dan, the Wasatch Sasquatch</p>
          <p className="text-white/90 mt-6 leading-relaxed">
            From secret swimming holes to hidden viewpoints, Dan knows every trail, every shortcut, and every local favorite. 
            He&apos;s your insider guide to authentic Utah adventures—whether you&apos;re here for the 2034 Olympics or just seeking your next great story.
          </p>
        </div>
      </div>
    </section>
  );
}


