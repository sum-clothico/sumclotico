import Navbar from "../../components/Navbar";
import OurStoryClient from "../../components/OurStoryClient";

export const metadata = {
  title: "Our Story - Sum Clothico",
  description: "There was a time when fabric was not made in factories. It was made at home. Slowly. Carefully. By hand.",
};

export default function OurStoryPage() {
  return (
    <main>
      <Navbar />
      <OurStoryClient />
    </main>
  );
}
