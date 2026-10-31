import Navbar from "../../components/Navbar";
import PageHeaderHero from "../../components/PageHeaderHero";
import FabricClient from "../../components/FabricClient";

export const metadata = {
  title: "Understanding the Fabric - Sum Clothico",
  description: "Khadi is a fabric made from natural fibers like cotton, but what makes it special is how it is made.",
};

export default function FabricPage() {
  return (
    <main>
      <Navbar />
      <PageHeaderHero
        badgeText="TEXTILE ARCHIVE"
        title="Understanding the Fabric"
        subtitle="The story of pure Indian Khadi — spun by human hand, woven at human pace."
        breadcrumb="Home / Fabric"
      />
      <FabricClient />
    </main>
  );
}
