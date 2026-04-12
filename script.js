let allSongs = [];

// FETCH
async function fetchMusic() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    document.getElementById("loading").style.display = "block";

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`;
        console.log("Fetching:", url);

        const res = await fetch(url);
        const data = await res.json();

        console.log("DATA:", data);

        allSongs = data.results || [];

        populateGenres();
        updateView();
    } catch (e) {
        console.error(e);
        alert("Error fetching data");
    }

    document.getElementById("loading").style.display = "none";
}

// GENRES
function populateGenres() {
    const genres = [...new Set(allSongs.map(s => s.primaryGenreName).filter(Boolean))];
    const dropdown = document.getElementById("genreFilter");

    dropdown.innerHTML = '<option value="">All Genres</option>';

    genres.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g;
        opt.textContent = g;
        dropdown.appendChild(opt);
    });
}

// MAIN LOGIC
function updateView() {
    let temp = [...allSongs];

    const search = document.getElementById("searchInput").value.toLowerCase();
    const genre = document.getElementById("genreFilter").value;
    const sort = document.getElementById("sortOption").value;

    // SEARCH
    if (search) {
        temp = temp.filter(song =>
            (song.trackName || "").toLowerCase().includes(search)
        );
    }

    // FILTER
    if (genre) {
        temp = temp.filter(song =>
            song.primaryGenreName === genre
        );
    }

    // SORT
    if (sort === "alpha") {
        temp.sort((a, b) =>
            (a.trackName || "").localeCompare(b.trackName || "")
        );
    } else if (sort === "date") {
        temp.sort((a, b) =>
            new Date(b.releaseDate) - new Date(a.releaseDate)
        );
    }

    render(temp);
}

// RENDER
function render(songs) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (!songs || songs.length === 0) {
        container.innerHTML = "<p>No results found</p>";
        return;
    }

    songs.forEach(song => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${song.artworkUrl100 || ''}">
            <h3>${song.trackName || "No Name"}</h3>
            <p>${song.artistName || "Unknown Artist"}</p>
            <p>${song.primaryGenreName || ""}</p>
        `;

        container.appendChild(card);
    });
}

// EVENTS
document.getElementById("searchInput").addEventListener("input", updateView);
document.getElementById("genreFilter").addEventListener("change", updateView);
document.getElementById("sortOption").addEventListener("change", updateView);