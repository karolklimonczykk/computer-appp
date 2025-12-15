import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main id="home">
        <Image
          className="logo"
          src="politechnika-krakowska-logo.svg"
          alt="Logo Politechniki Krakowskiej"
          width={100}
          height={100}
          priority
        />
        <div>Witajcie na stronie Sklepu Komputerowego 2025KK!</div>
      </main>
    </div>
  );
}
