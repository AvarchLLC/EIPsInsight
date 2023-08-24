import React, {useEffect, useState} from 'react';
import NextLink from "next/link";


interface PRItem {
    prNumber: number;
}

const SearchBox: React.FC = () => {
    const [data, setData] = useState<PRItem[]>([]);
    const [query, setQuery] = useState('');

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

    const filteredResults = data.filter(item =>
        item.prNumber.toString().includes(query)
    );

    const handleSearchResultClick = (selectedPRNumber: number) => {
        window.location.href = `/PR/${selectedPRNumber}`;
        return selectedPRNumber;
    };

    return(
        <>
            <div>
                <input
                    type="text"
                    placeholder="Search a Pull Request"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="border p-2 rounded w-full text-center focus:border-blue-100"
                />
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
        </>
    )
}

export default SearchBox;