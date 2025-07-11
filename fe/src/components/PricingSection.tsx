
import React, { useState } from "react";

const services = {
  Tagli: [
    { name: "Taglio uomo", price: "25€" },
    { name: "Taglio bambino (fino a 12 anni)", price: "20€" },
    { name: "Taglio + barba", price: "35€" },
    { name: "Taglio + shampoo", price: "30€" },
    { name: "Taglio completo (taglio + barba + shampoo)", price: "40€" },
  ],
  Barba: [
    { name: "Regolazione barba", price: "15€" },
    { name: "Rasatura tradizionale", price: "18€" },
    { name: "Barba + trattamento", price: "22€" },
  ],
  Trattamenti: [
    { name: "Trattamento cute", price: "20€" },
    { name: "Trattamento rinforzante", price: "25€" },
  ],
  Colorazione: [
    { name: "Colorazione capelli", price: "30€" },
    { name: "Colpi di sole", price: "35€" },
  ],
};

const tabList = Object.keys(services);

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState(tabList[0]);

  return (
    <section className="bg-[#f7f5f2] py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Title and Subtext */}
        <div className="mb-8 text-left">
        <h2 className="text-4xl md:text-5xl font-[Merriweather] font-bold mb-8 text-salon-black">
        Listino <span className="font-[kaushan] text-[#EAB308]">Prezzi</span>
          </h2>
          <p className="text-lg text-gray-600 ">
            Scopri i nostri servizi e trova l’opzione perfetta per il tuo stile.
          </p>
        </div>
        {/* Tabs - pill style, full width, evenly spaced, consistent roundness */}
        <div className="flex w-full bg-[#ffffff] rounded-2xl p-1 mb-8">
          {tabList.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-2 rounded-xl font-semibold transition
                ${activeTab === tab
                  ? "bg-white shadow text-gray-900 border-2 border-orange-200"
                  : "bg-transparent text-gray-500 hover:bg-white/60 border-2 border-transparent"
                }
                ${idx !== tabList.length - 1 ? "mr-2" : ""}
              `}
              style={{
                minWidth: 0,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Main content: parent flex with items-stretch */}
        <div className="flex flex-col md:flex-row items-stretch gap-y-12 md:gap-x-12">
          {/* Left: Image */}
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="w-full max-w-[480px] h-full flex items-center">
              <img
                src="/lovable-uploads/3a225dd3-1850-4188-9a73-af6246e8e6b9.png"
                alt="Barber at work"
                className="rounded-2xl shadow-lg w-full object-cover"
                style={{ minHeight: 280, maxHeight: 400 }}
              />
            </div>
          </div>
          {/* Right: Pricing Card */}
          <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col justify-center min-h-[280px]">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              {activeTab === "Tagli" && "Servizi Di Taglio"}
              {activeTab === "Barba" && "Servizi Barba"}
              {activeTab === "Trattamenti" && "Trattamenti"}
              {activeTab === "Colorazione" && "Colorazione"}
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-gray-700 font-semibold pb-2">Servizio</th>
                  <th className="text-right text-gray-700 font-semibold pb-2">Prezzo</th>
                </tr>
              </thead>
              <tbody>
                {services[activeTab].map((item, idx) => (
                  <tr className="border-t" key={idx}>
                    <td className="py-2 text-gray-800">{item.name}</td>
                    <td className="py-2 text-right text-yellow-500 font-bold">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
