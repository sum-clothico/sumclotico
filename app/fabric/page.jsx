import Navbar from "../../components/Navbar";
import FabricClient from "../../components/FabricClient";

export const metadata = {
  title: "Understanding the Fabric - Sum Clothico",
  description: "Khadi is a fabric made from natural fibers like cotton, but what makes it special is how it is made.",
};

export default function FabricPage() {
  return (
    <main>
      <Navbar />
      <FabricClient />
    </main>
  );
}
