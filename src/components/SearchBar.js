import React, {useState, useEffect} from "react";

const SearchBar = ({items}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
     const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    useEffect(() => {
        const results = items.filter(item =>
            item.url
        );
        setSearchResults(results);
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />
            <ul>
                {searchResults.map(item => (
                    <li key={item.id}>{items}</li>
                ))}
            </ul>
        </div>
    );
}
export default SearchBar;