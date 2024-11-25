import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="container py-4 flex flex-col items-center gap-8">
      <Image
        src="/logo.webp"
        alt="logo"
        width={234}
        height={40}
        className="mx-auto"
      />
      <Image
        src="/paslon.webp"
        alt="paslon"
        width={700}
        height={400}
        className="rounded-lg"
      />
      <div className="relative flex flex-wrap justify-center gap-2">
        {[
          "/hanura.webp",
          "/demokrat.webp",
          "/pdi.webp",
          "/perindo.webp",
          "/pbb.webp",
          "/gelora.webp",
          "/pkb.webp",
        ].map((src, i) => (
          <div key={i} className="relative h-[50px]">
            <Image
              src={src}
              alt="partai"
              width={100}
              height={100}
              className="h-full w-auto"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center space-y-2">
        {/* <Link href="/dashboard">
          <Button className="text-xl">JADWAL KAMPANYE</Button>
        </Link> */}
        <Link href="https://input-suara.adi-cipta.com/" target="_blank">
          <Button variant="outline" className="text-xl">
            INPUT SUARA
          </Button>
        </Link>
      </div>
      <div className="max-w-2xl space-y-2 tracking-tight">
        <h2 className="text-2xl font-semibold text-center underline">
          VISI & MISI
        </h2>
        <div>
          <h3 className="text-lg font-semibold">VISI</h3>
          <p>Membangun Masyarakat Adil Makmur, Lestari, dan Berkeadaban</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">MISI</h3>
          <ol className="list-decimal list-inside text-justify">
            <li>
              Meningkatkan pembangunan manusia yang produktif, berkualitas, dan
              berkepribadian untuk siap kerja dan siap merintis usaha sendiri.
            </li>
            <li>
              Memastikan akses kesehatan untuk rakyat guna menciptakan manusia
              Indonesia yang sehat jasmani dan rohani.
            </li>
            <li>
              Mewujudkan keadilan sosial melalui kebijakan yang memperkuat
              kapasitas ekonomi rakyat, termasuk kapasitas produksi pangan oleh
              petani dan nelayan, serta mendukung kegiatan ekonomi skala kecil –
              menengah yang inklusif dan kreatif.
            </li>
            <li>
              Membangun Kemandirian Ekonomi Daerah berbasis potensi sumber daya
              lokal.
            </li>
            <li>
              Setia pada Amanat Penderitaan Rakyat (Ampera), Pancasila, UUD
              1945, menjunjung tinggi hukum demi menjamin hak-hak rakyat, serta
              menjalankan tata pemerintahan daerah yang bersih bebas dari
              korupsi dan berkeadaban.
            </li>
            <li>
              Memajukan kebudayaan setempat dalam semangat kebhinekaan dan
              toleransi serta menjaga kelestarian lingkungan hidup warisan
              leluhur bangsa Indonesia.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
