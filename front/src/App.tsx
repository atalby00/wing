import "./App.css";
import { Header } from "./features/header/Header";
import { ParcelList } from "./features/parcelList/ParcelList";
import { useFetchParcels } from "./hooks/useFetchParcels";
import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { SidebarSection } from "./components/sidebarSection";

function App() {
  const [selectedPalette, setSelectedPalette] = useState(1);
  const { parcels, getNbPaletes, getParcelsFromPalette } = useFetchParcels();
  const parcelsFromSelectedPalette = getParcelsFromPalette(selectedPalette);
  const nbPalettes = getNbPaletes();

  useEffect(() => {
    getParcelsFromPalette(selectedPalette);
  }, [selectedPalette, getParcelsFromPalette]);

  const handlePaletteChange = useCallback(
    (paletteNumber: number) => {
      setSelectedPalette(paletteNumber);
    },
    [setSelectedPalette]
  );

  return (
    <div className="flex flex-row h-full">
      <Sidebar>
        {Array.from({ length: nbPalettes }).map((_, index) => (
          <SidebarSection
            key={index}
            sectionNumber={index + 1}
            onClick={handlePaletteChange}
          >
            <p className="font-medium text-base">Palette {index + 1}</p>
          </SidebarSection>
        ))}
      </Sidebar>
      <div className="w-100 flex-1">
        <Header />
        <ParcelList parcels={parcelsFromSelectedPalette} />
      </div>
    </div>
  );
}

export default App;
