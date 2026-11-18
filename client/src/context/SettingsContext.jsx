import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        company_name: 'Global Scientific Trade Pvt. Ltd.',
        company_tagline: 'Trusted Supplier of Scientific, Engineering & Laboratory Equipment',
        company_address: 'Swayambhu, Kathmandu & Dhangadhi, Nepal',
        company_phone: 'KTM: +977 1-5924298 | Dhangadhi: +977 91-591014, +977 9847879700',
        phone_ktm: '+977 1-5924298',
        phone_dhangadhi_landline: '+977 91-591014',
        phone_dhangadhi_mobile: '+977 9847879700',
        address_ktm: 'Swayambhu, Kathmandu, Nepal',
        address_dhangadhi: 'Dhangadhi, Kailali, Sudurpashchim, Nepal',
        company_email: 'gsciencehouse2077@gmail.com',
        company_tiktok: 'https://tiktok.com/@gscientific2077',
        about_story: 'Global Scientific Trade Pvt. Ltd. is a leading supplier of scientific and laboratory equipment based in Swayambhu, Kathmandu.',
        facilities: [
            'Complete Laboratory Setup',
            'Educational & Research Equipment',
            'Medical & Hospital Instruments',
            'Engineering & Survey Tools',
            'Quality Products at Competitive Price',
            'Institutional & Bulk Supply',
            'Trusted After-Sales Support',
            'Nationwide Fast Delivery'
        ],
        announcement: 'Trusted supplier of laboratory, engineering & educational equipment in Kathmandu, Nepal.'
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [contentData, catsData] = await Promise.all([
                api.getContent().catch(() => ({ settings: {} })),
                api.getCategories().catch(() => ({ categories: [] }))
            ]);

            if (contentData.settings && Object.keys(contentData.settings).length > 0) {
                setSettings(prev => ({ ...prev, ...contentData.settings }));
            }
            if (catsData.categories) {
                setCategories(catsData.categories);
            }
        } catch (err) {
            console.error('Failed to load settings or categories', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <SettingsContext.Provider value={{
            settings,
            categories,
            loading,
            refreshSettings: loadData
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
