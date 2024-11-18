import { Button } from "@headlessui/react"
import BannerImg from "../../assets/banner.png"
import { LuBellRing } from "react-icons/lu";

const Banner = () => {
    return (
        <div className="flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12">
            <div className="md:w-1/2 w-full flex items-center md:justify-end">
                <img src={BannerImg} alt="Banner Image" />
            </div>

            <div className="md:w-1/2 w-full">
                <h1 className="md:text-5xl text-2xl font-medium mb-7">New Releases This Week</h1>
                <p className="mb-10">
                    It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone.
                </p>
                <Button
                    className="rounded bg-[#4D47C3] hover:bg-[#3833a0] py-2 px-4 text-sm text-white flex items-center justify-center gap-1"
                >
                    <LuBellRing />
                    <span>Subscribe</span>
                </Button>
            </div>

        </div>
    )
}

export default Banner