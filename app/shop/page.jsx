import Navbar from "@/components/Navbar";
import CollectionClient from "@/components/CollectionClient";

export const metadata = {
  title: "Shop All Pieces — Sum Clothico",
  description: "Explore all handcrafted silhouettes in pure Khadi cotton and handwoven Indian textiles. Thoughtfully made for your everyday life.",
};

export default function ShopPage() {
  return (
    <main>
      <Navbar />
      <CollectionClient />
    </main>
  );
}
