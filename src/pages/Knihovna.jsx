useEffect(() => {
    const savedCode = localStorage.getItem('sl_passcode') || '';
    setLoading(true);
    // Posíláme passcode i do hlavního výpisu, aby se správně vyhodnotil VIP status[cite: 1]
    fetch(`/api/get-library?passcode=${savedCode}`)
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Chyba serveru (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        // Naše nové API vrací objekt { items, isUserVip }
        if (data && Array.isArray(data.items)) {
          setItems(data.items);
          setFilteredItems(data.items);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
