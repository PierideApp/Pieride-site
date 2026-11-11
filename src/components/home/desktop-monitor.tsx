import Image from "next/image";
import { withBasePath } from "@/lib/site-path";

type DesktopMonitorProps = {
  src: string;
  alt: string;
  caption?: string;
  sizes: string;
  className?: string;
};

export function DesktopMonitor({ src, alt, caption, sizes, className = "" }: DesktopMonitorProps) {
  return (
    <figure className={`group relative mx-auto w-full min-w-0 transition duration-500 hover:-translate-y-1 ${className}`}>
      <div className="relative isolate px-1 pb-12 sm:px-2 sm:pb-[3.5rem]">
        <div className="relative z-10 overflow-hidden rounded-[1.25rem] border border-[#51545d] bg-linear-to-br from-[#3b3e47] via-[#1d2027] to-[#30333b] p-[7px] pb-0 shadow-[0_34px_85px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-shadow duration-500 group-hover:shadow-[0_42px_95px_-28px_rgba(0,0,0,0.9)] sm:rounded-[1.55rem] sm:p-[10px] sm:pb-0">
          <div className="overflow-hidden rounded-[0.8rem] border border-black/60 bg-[#0d0f13] shadow-inner">
            <Image src={withBasePath(src)!} alt={alt} width={1440} height={900} unoptimized sizes={sizes} className="block h-auto w-full transition duration-700 ease-out group-hover:scale-[1.012]" />
          </div>
          <div aria-hidden className="relative flex h-6 items-center justify-center bg-linear-to-b from-[#272a31] to-[#202229] sm:h-7">
            <span className="size-1.5 rounded-full border border-white/10 bg-[#50535a] shadow-inner" />
            <span className="absolute right-3 size-1.5 rounded-full bg-[#555963] opacity-70" />
          </div>
        </div>
        <div aria-hidden className="absolute bottom-2 left-1/2 z-0 h-10 w-[17%] -translate-x-1/2 bg-linear-to-r from-[#17191e] via-[#3a3d45] to-[#17191e] [clip-path:polygon(29%_0,71%_0,88%_100%,12%_100%)] sm:h-12" />
        <div aria-hidden className="absolute bottom-0 left-1/2 z-10 h-2 w-[48%] -translate-x-1/2 rounded-full border border-white/10 bg-linear-to-b from-[#444750] to-[#24262d] shadow-[0_7px_14px_rgba(0,0,0,0.4)] sm:h-2.5 sm:w-[45%]" />
      </div>
      {caption ? <figcaption className="-mt-1 text-center text-xs font-medium text-white/50 sm:text-sm">{caption}</figcaption> : null}
    </figure>
  );
}
