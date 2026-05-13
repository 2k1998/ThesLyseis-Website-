import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Επικοινωνία | Θες Λύσεις",
  description: "Συμπληρώστε τα στοιχεία σας για να ξεκινήσετε έναν δωρεάν έλεγχο εξοικονόμησης ενέργειας.",
};

export default function ContactPage() {
  return (
    <main className="w-full mt-16 md:mt-20">
      <ContactForm />
    </main>
  );
}
