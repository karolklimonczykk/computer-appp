export default function Footer() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pl-PL");
  return (
    <footer className="py-4 border-t border-black/6 mt-8">
      <div className="flex justify-between gap-4 items-center w-[90%] max-w-[60rem] mx-auto text-[#e5e5e1] md:flex-row flex-col md:items-center items-start">
        <div>Autor: Karol Klimończyk</div>
        <div>Data: {dateStr}</div>
        <div>
          <a href="https://www.pk.edu.pl" target="_blank" rel="noopener noreferrer" className="underline text-[#e5e5e1]">
            Politechnika Krakowska
          </a>
        </div>
      </div>
    </footer>
  );
}
