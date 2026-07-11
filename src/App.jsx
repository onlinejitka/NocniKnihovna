function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('sl_cookies_confirmed_2026');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sl_cookies_confirmed_2026', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-950/98 border border-slate-800 p-5 rounded-2xl shadow-2xl z-50 animate-fade-in backdrop-blur-md flex flex-col space-y-4">
      <div className="flex items-start space-x-3">
        <Info size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Informace o souborech cookies</h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tento web používá nezbytné technické cookies pro správné fungování (uložení Premium kódu). Dále využíváme cookies třetích stran pro spuštění videí z <strong>YouTube</strong>, přehrávání hudby ze <strong>Spotify</strong> a pro správnou funkčnost doporučujících partnerských odkazů.
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-3 items-center text-[10px]">
        <Link to="/gdpr" className="text-slate-500 hover:text-slate-300 transition underline">Více informací</Link>
        <button 
          onClick={handleAccept}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-lg"
        >
          Přijmout vše
        </button>
      </div>
    </div>
  );
}
