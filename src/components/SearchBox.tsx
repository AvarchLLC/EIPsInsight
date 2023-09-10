import React, {useEffect, useState} from 'react';
import NextLink from "next/link";
import {usePathname} from "next/navigation";


interface PRItem {
    prNumber: number;
}

interface EIP {
    _id: string;
    eip: string;
    title: string;
    author: string;
    status: string;
    type: string;
    category: string;
    created: string;
    discussion: string;
    deadline: string;
    requires: string;
    unique_ID: number;
    __v: number;
}

const SearchBox: React.FC = () => {
    const [data, setData] = useState<PRItem[]>([]);
    const [eipData, setEipData] = useState<EIP[]>([]);
    const [query, setQuery] = useState('');
    const router = usePathname();
    const splitPath = router?.split('/') || [];
    const type = splitPath[1] || 'eip';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/allprs`);
                console.log(response);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
                const jsonData = await response.json();
                setEipData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const filteredResults = data.filter(item =>
        item.prNumber.toString().includes(query)
    );

    const filteredEIPResults = eipData.filter(item =>
        item.eip.toString().includes(query)
    );

    const handleSearchResultClick = (selectedPRNumber: number) => {
        window.location.href = `/PR/${selectedPRNumber}`;
        return selectedPRNumber;
    };

    const EIPhandleSearchResultClick = (selectedEIPNumber: string) => {

        window.location.href = `/EIPS/${selectedEIPNumber}`;
        return selectedEIPNumber;
    };

    return(
        <>
            <div>
                <input
                    type="text"
                    placeholder="Search Pull Request or EIP"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="border p-2 rounded w-full text-center focus:border-blue-100"
                />

                <div className={'grid grid-cols-2'}>
                    <div>
                        {query && filteredResults.length === 0 ? (
                            <p className="mt-2 text-red-500 text-center font-bold">PR Not Found</p>
                        ) : (
                            query && (
                                <select className={`mt-2 border p-2 rounded w-full text-center space-y-5`} size={10}>
                                    {filteredResults.map(result => (
                                        <option key={result.prNumber} value={result.prNumber} onClick={() => handleSearchResultClick(result.prNumber)} className={'py-2'}>
                                            PR Number: {result.prNumber}
                                        </option>
                                    ))}
                                </select>
                            )
                        )}
                    </div>

                    <div>
                        {query && filteredEIPResults.length === 0 ? (
                            <p className="mt-2 text-red-500 text-center font-bold">EIP Not Found</p>
                        ) : (
                            query && (
                                <select className={`mt-2 border p-2 rounded w-full text-center space-y-5`} size={10}>
                                    {filteredEIPResults.map(result => (
                                        <option key={result.eip} value={result.eip} onClick={() => EIPhandleSearchResultClick(result.eip)} className={'py-2'}>
                                            EIP Number: {result.eip}
                                        </option>
                                    ))}
                                </select>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchBox;