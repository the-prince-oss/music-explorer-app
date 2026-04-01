async function searchMusic() {
    const query = document.getElementById("searchInput").value;

    if (!query) return;

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const url = `https://itunes.apple.com/search?term=${query}&limit=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayResults(data.results);
    } catch (error) {
        alert("Error fetching data");
    }

    loading.style.display = "none";
}

function displayResults(songs) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (songs.length === 0) {
        resultsDiv.innerHTML = "<p>No results found</p>";
        return;
    }

    songs.forEach(song => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${song.artworkUrl100}">
            <h3>${song.trackName}</h3>
            <p>${song.artistName}</p>
        `;

        resultsDiv.appendChild(div);
    });
}