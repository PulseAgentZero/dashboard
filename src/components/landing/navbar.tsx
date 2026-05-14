import Link from 'next/link';
// import { BladeFan } from '../../../public/icon/bladeFan';

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-16 py-6 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center gap-2">
        {/* Replace with actual SVG logo from screenshot if available */}
        <span className="text-white font-black tracking-tighter text-2xl uppercase italic">
          <div className='flex flex-row items-center gap-2'>
            {/* <div
          className="animate-spin"
          style={{ animationDuration: "9s" }}
        >
          <BladeFan color='white' size={25} strokeWidth={3} /> 
        </div> */}
            <p>PulseData</p>
          </div>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="#" className="hover:text-white transition-colors">Works</Link>
        <Link href="#" className="hover:text-white transition-colors">Features</Link>
        <Link href="#" className="hover:text-white transition-colors">About</Link>
        <Link href="#" className="hover:text-white transition-colors">Platform</Link>
        <Link href="#" className="hover:text-white transition-colors">Deploy</Link>
        <Link 
          href="/auth/signup" 
          className="ml-4 bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}