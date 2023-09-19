import "./App.css";
import { Header } from "./features/header/Header";
import { ParcelList } from "./features/parcelList/ParcelList";
import { useFetchParcels } from "./hooks/useFetchParcels";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { SidebarSection } from "./components/sidebarSection";
import Loader from "./components/loader";

function App() {
  const [selectedPalette, setSelectedPalette] = useState(1);
  const {
    parcels,
    earnings,
    getNbPaletes,
    getParcelsFromPalette,
    getNbItems,
    error,
  } = useFetchParcels();
  const parcelsFromSelectedPalette = useMemo(
    () => getParcelsFromPalette(selectedPalette),
    [getParcelsFromPalette, selectedPalette]
  );
  // eslint-disable-next-line
  const nbPalettes = useMemo(() => getNbPaletes(), [getNbPaletes, parcels]);
  // eslint-disable-next-line
  const nbItems = useMemo(() => getNbItems(), [getNbItems, parcels]);

  useEffect(() => {
    getParcelsFromPalette(selectedPalette);
  }, [selectedPalette, getParcelsFromPalette]);

  const handlePaletteChange = useCallback(
    (paletteNumber: number) => {
      setSelectedPalette(paletteNumber);
    },
    [setSelectedPalette]
  );

  if (error) {
    return <>{error}</>;
  }

  if (!parcels) {
    return (
      <div className="flex flex-row justify-center align-center h-full mt-10">
        <Loader size={100} color="#111" />
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full">
      <Sidebar>
        {Array.from({ length: nbPalettes }).map((_, index) => (
          <SidebarSection
            key={index}
            sectionNumber={index + 1}
            selectedPalette={selectedPalette}
            onClick={handlePaletteChange}
          >
            <p className="font-medium text-base">Palette {index + 1}</p>
          </SidebarSection>
        ))}
      </Sidebar>
      <div className="w-100 flex-1 max-w-7xl mx-auto px-4">
        <Header
          earnings={earnings}
          nbPalettes={nbPalettes}
          totalItems={nbItems}
        />
        <ParcelList parcels={parcelsFromSelectedPalette} />
      </div>
    </div>
  );
}

export default App;
