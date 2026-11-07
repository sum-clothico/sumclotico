import Navbar from "../../components/Navbar";
import PageHeaderHero from "../../components/PageHeaderHero";
import OurStoryClient from "../../components/OurStoryClient";

export const metadata = {
  title: "Our Story - Sum Clothico",
  description: "There was a time when fabric was not made in factories. It was made at home. Slowly. Carefully. By hand.",
};

export default function OurStoryPage() {
  return (
    <main>
      <Navbar />
      <PageHeaderHero
        bgImage="/assets/about/IMG_1040.JPG"
        badgeText="THE SUM STORY"
        title="The Sum Story"
        subtitle=""
        breadcrumb="Home / Our Story"
      />
      <OurStoryClient />
    </main>
  );
}
