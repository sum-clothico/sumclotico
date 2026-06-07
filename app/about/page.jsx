import Navbar from "../../components/Navbar";
import AboutClient from "../../components/AboutClient";

export const metadata = {
  title: "About Us - Sum Clothico",
  description: "Sum Clothico is a contemporary womenswear brand rooted in the ethos of handmade Khadi.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutClient />
    </main>
  );
}
