import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/page";
import FeaturedStories from "@/components/FeaturedStories";
import CoverStoriesSection from "@/components/CoverStoriesSection";
import ArticlesSection from "@/components/ArticlesSection";
import MagazinesSection from "@/components/MagazinesSection";
import CategoriesSection from "@/components/CategoriesSection";
import HallOfFameSection from "@/components/HallOfFameSection";
import AwardsSection from "@/components/AwardsSection";
import NewsSection from "@/components/NewsSection";
import PodcastsSection from "@/components/PodcastsSection";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* HOME */}
        <section id="home">
          <Hero />
        </section>

        {/* FEATURED STORIES */}
        <section id="featured-stories">
          <FeaturedStories />
        </section>

        {/* COVER STORIES */}
        <CoverStoriesSection />

        {/* ARTICLES */}
        <section id="articles">
          <ArticlesSection />
        </section>

        {/* MAGAZINES */}
        <MagazinesSection />

        {/* CATEGORIES */}
        <CategoriesSection />

        {/* HALL OF FAME */}
        <HallOfFameSection />

        {/* AWARDS */}
        <AwardsSection />

        {/* NEWS */}
        <NewsSection />
        
        {/* PODCASTS */}
        <PodcastsSection />

        {/* FOOTER */}
        <Footer />

      </main>
    </>
  );
}

