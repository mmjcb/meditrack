import React from 'react';
import SearchBar from '../Components/searchbar';

export default function Search() {
    return(
        <main style={styles.main}>
            <SearchBar />
        </main>
    );
}

const styles = {
    main: {
        paddingTop: '120px', // so it’s not hidden under the fixed navbar
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: '2rem',
        color: '#202020',
        marginBottom: '20px',
    },
};
