export const fetchContacts = async (contacts, setContacts, country = '', search = '', currentPage = 1, setIsLoading) => {
    setIsLoading(true);

    let apiUrl = `https://contact.mediusware.com/api/contacts/?page=${currentPage}`;

    if (country && search) {
        apiUrl = `https://contact.mediusware.com/api/country-contacts/${country}/?search=${search}`;
    } else if (country) {
        apiUrl = `https://contact.mediusware.com/api/country-contacts/${country}/?page=${currentPage}`;
    } else if (search) {
        apiUrl = `https://contact.mediusware.com/api/contacts/?search=${search}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const result = data.results;
        const combinedData = [...contacts, ...result];
        if (search) {
            setContacts(result);
            return;
        }
        const uniqueData = Array.from(new Set(combinedData.map(contact => contact.id))).map(id => {
            return combinedData.find(contact => contact.id === id);
        });

        setContacts(uniqueData);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    } finally {
        setIsLoading(false);
    }
};
