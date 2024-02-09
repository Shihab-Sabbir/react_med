export const fetchContacts = async (setContacts, country = '', search = '', currentPage, setIsLoading) => {
    setIsLoading(true)
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
        setContacts(data.results)
        return

    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
    finally {
        setIsLoading(false)
    }
};
