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
        badgeText="THE SUM STORY"
        title="Rooted in Handwoven Living"
        subtitle="Sum is a sum of people, ideas, skills, places and techniques. And eventually, you."
        breadcrumb="Home / Our Story"
      />
      <OurStoryClient />
    </main>
  );
}
