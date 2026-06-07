import Navbar from "../../components/Navbar";
import CollectionClient from "../../components/CollectionClient";

export const metadata = {
  title: "Collection - Sum Clothico",
  description: "Pieces designed for how you live today.",
};

export default function CollectionPage() {
  return (
    <main>
      <Navbar />
      <CollectionClient />
    </main>
  );
}
