function display_track_display() {

    const user_search = document.getElementById("input-field").value;

    document.getElementById("track-artist").innerHTML = '';

    fetch('https://spotify-webapp-backend.onrender.com/get_track_search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: user_search })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("photo").src = data.tracks.items[0].album.images[0].url;
        document.getElementById("photo-clickable").href = data.tracks.items[0].external_urls.spotify;

        const track_name = data.tracks.items[0].name;
        if (track_name.length > 60) {
            document.getElementById("track-name").innerHTML = track_name.substring(0, 60) + "...";
        } else {
            document.getElementById("track-name").innerHTML = track_name;
        }

        document.getElementById("track-duration").innerHTML = formatMilliseconds(data.tracks.items[0].duration_ms);
        document.querySelector(".duration-container").classList.remove("hide");
        
        document.getElementById("track-popularity-number").innerHTML = data.tracks.items[0].popularity;
        document.getElementById('popularity-bar').style.width = data.tracks.items[0].popularity + '%';
        const backgroundColor = calculateBackgroundColor(data.tracks.items[0].popularity);
        document.getElementById("track-popularity-number").style.backgroundColor = backgroundColor;
        document.getElementById("popularity-bar").style.backgroundColor = backgroundColor;
        document.querySelector(".popularity-container").classList.remove("hide");

        document.getElementById("track-explicit").innerHTML = data.tracks.items[0].explicit ? "Explicit" : "Not Explicit";
        if(document.getElementById("track-explicit").innerHTML == "Explicit") {
            document.querySelector(".track-explicit-container").style.backgroundColor = " #CC3333";
        } else {
            document.querySelector(".track-explicit-container").style.backgroundColor = "#2ecc71";
        }
        document.querySelector(".track-explicit-container").classList.remove("hide");

        document.querySelector("source").src = data.tracks.items[0].preview_url;
        document.querySelector("audio").load();
        document.querySelector("audio").classList.remove("hide");

        let artistMap = {};
        let artistCount = 0;
        data.tracks.items[0].artists.forEach((artist, index) => {
            if (artistCount < 6) {
                if (!artistMap[artist.name]) {
                    artistMap[artist.name] = true;
                    document.getElementById("track-artist").innerHTML += `<span>${artist.name}</span> `;
                    artistCount++;
                }
            } else if (index === data.tracks.items[0].artists.length - 1) {
                document.getElementById("track-artist").innerHTML += `<span>...</span>`;
            }
        });
        if (artistCount > 1) {
            document.getElementById("track-artist-title").innerHTML = "ARTISTS"
        } else {
            document.getElementById("track-artist-title").innerHTML = "ARTIST"
        }
        document.querySelector(".track-artist-container").classList.remove("hide");

        let albumTitle = data.tracks.items[0].album.name;
        if (albumTitle.length > 60) {
            document.getElementById("track-album").innerHTML = albumTitle.substring(0, 60) + "...";
        } else {
            document.getElementById("track-album").innerHTML = albumTitle;
        }
        document.getElementById("track-release-date").innerHTML = data.tracks.items[0].album.release_date;
        if (data.tracks.items[0].album.total_tracks === 1) {
            document.getElementById("track-album-title").innerHTML = "SINGLE TRACK"
        } else {
            document.getElementById("track-album-title").innerHTML = "TRACK ALBUM"
        }
        document.querySelector(".album-and-release-date").classList.remove("hide");
    })
}



function trashButton() {
    const input_b = document.getElementById("input-field");
    input_b.value = '';
}

function formatMilliseconds(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
}

function calculateBackgroundColor(popularityValue) {
    if (popularityValue >= 75) {
        return '#1db954';
    } else if (popularityValue >= 50) {
        return '#f1c40f';
    } else {
        return '#e74c3c';
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    
      var button = document.getElementById('search-button');
    
      if (button) {
        button.click();
      }
    }
});
