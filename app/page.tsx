import About from "@/components/About";
import Contact from "@/components/Contact";
import CursorLabel from "@/components/CursorLabel";
import DesignBehind from "@/components/DesignBehind";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import { LikamiProject, SwapClosetProject } from "@/components/Projects";
import SelectedWork from "@/components/SelectedWork";
import Toolkit from "@/components/Toolkit";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <About />
        <Toolkit />
        <SelectedWork />
        <SwapClosetProject />
        <LikamiProject />
        <DesignBehind />
        <Contact />
      </main>
      <CursorLabel />
    </>
  );
}
