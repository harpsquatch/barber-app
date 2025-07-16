
import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';

interface Service {
  service_id: number;
  category: string;
  name: string;
  price: string;
}

interface ServicesByCategory {
  [key: string]: Service[];
}

const PricingSection = () => {
  const [services, setServices] = useState<ServicesByCategory>({});
  const [tabList, setTabList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [pricingTitle, setPricingTitle] = useState('Listino Prezzi');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('service_id, category, name, price')
          .order('service_id');

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        if (data) {
          // Group services by category
          const groupedServices: ServicesByCategory = {};
          data.forEach((service: Service) => {
            if (!groupedServices[service.category]) {
              groupedServices[service.category] = [];
            }
            groupedServices[service.category].push(service);
          });

          setServices(groupedServices);
          const categories = Object.keys(groupedServices);
          setTabList(categories);
          
          // Set active tab to first category if available
          if (categories.length > 0 && !activeTab) {
            setActiveTab(categories[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchPricingTitle = async () => {
      try {
        const { data, error } = await supabase
          .from('general_info')
          .select('pricing_title')
          .single();
        if (error) {
          console.error('Error fetching pricing title:', error);
          return;
        }
        if (data && data.pricing_title) {
          setPricingTitle(data.pricing_title);
        }
      } catch (error) {
        console.error('Error fetching pricing title:', error);
      }
    };
    fetchPricingTitle();
  }, []);

  function renderStyledTitle(title) {
    const words = title.trim().split(' ');
    if (words.length === 1) {
      return <span className="font-[kaushan] text-[#EAB308]">{words[0]}</span>;
    }
    const lastWord = words.pop();
    return <>{words.join(' ')} <span className="font-[kaushan] text-[#EAB308]">{lastWord}</span></>;
  }

  return (
    <section className="bg-[#f7f5f2] py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Title and Subtext */}
        <div className="mb-8 text-left">
          <h2 className="text-4xl md:text-5xl font-[Merriweather] font-bold mb-8 text-salon-black">
            {isLoading ? renderStyledTitle('Listino Prezzi') : renderStyledTitle(pricingTitle)}
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
              {activeTab ? `Servizi ${activeTab}` : 'Servizi'}
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-gray-700 font-semibold pb-2">Servizio</th>
                  <th className="text-right text-gray-700 font-semibold pb-2">Prezzo</th>
                </tr>
              </thead>
              <tbody>
                {services[activeTab]?.map((service, idx) => (
                  <tr className="border-t" key={service.service_id}>
                    <td className="py-2 text-gray-800">{service.name}</td>
                    <td className="py-2 text-right text-yellow-500 font-bold">{service.price}</td>
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
