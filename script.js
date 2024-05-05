function display_content() {
    fetch('https://spotify-webapp-backend.onrender.com/test_api_token')
        .then(() => {
            const user_search = document.querySelector(".input-field").value;

            fetch(`https://spotify-webapp-backend.onrender.com/get_artist_search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search: user_search })
            })
                .then(response => response.json())
                .then(data => {
                    let artist_id;
                    try {
                        artist_id = data.artists.items[0].id;
                    } catch (error) {
                        document.getElementById("error-message").innerHTML = "Sorry, This Artist Is Unavailable";
                        return;
                    }

                    fetch('https://spotify-webapp-backend.onrender.com/get_artist_info')
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById("website-logo").classList.add("hide");
                            document.getElementById("start-text").classList.add("hide");

                            if (document.getElementById("error-message").innerHTML !== "") {
                                document.getElementById("error-message").innerHTML = "";
                            }

                            try {
                                document.querySelector(".photo").style.backgroundImage = `url(${data.images[0].url})`;
                                document.querySelector(".photo").style.backgroundSize = 'cover';
                                document.querySelector(".photo").classList.remove("hide");
                                document.querySelector(".photo-missing").classList.add("hide");
                                document.getElementById("photo-clickable").href = `https://open.spotify.com/artist/${artist_id}`;
                            } catch (error) {
                                document.querySelector(".photo").classList.add("hide");
                                document.querySelector(".photo-missing").classList.remove("hide");
                            }

                            const topGenres = data.genres.slice(0, 3);
                            let genre_empty_boolean = true;
                            for (let i = 1; i <= 3; i++) {
                                const genreRow = document.querySelector(`.genre-row-${i}`);
                                if (topGenres[i - 1]) {
                                    genreRow.innerHTML = topGenres[i - 1].toUpperCase();
                                    genreRow.classList.remove("hide");
                                    genre_empty_boolean = false;
                                    document.querySelector(".missing-genres-error").classList.add("hide");
                                } else {
                                    genreRow.innerHTML = "";
                                    genreRow.classList.add("hide");
                                }
                            }
                            if (genre_empty_boolean) {
                                document.querySelector(".missing-genres-error").classList.remove("hide");
                            }

                            document.querySelector(".genres").classList.remove("hide");

                            document.querySelector("#followers-text").innerHTML = data.followers.total.toLocaleString();
                            document.querySelector(".followers").classList.remove("hide");

                            document.getElementById("name-text").innerHTML = data.name;

                            fetch('https://spotify-webapp-backend.onrender.com/get_artist_top_tracks')
                                .then(response => response.json())
                                .then(data => {
                                    const topTracks = data.tracks.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
                                    let isEmpty_tracks = true;

                                    for (let i = 1; i <= 5; i++) {
                                        const trackText = document.getElementById(`track${i}-text`);
                                        const trackPhoto = document.getElementById(`track${i}-photo`);
                                        const trackLink = document.getElementById(`tracks-clickable-${i}`);
                                        const track = topTracks[i - 1];

                                        if (track) {
                                            let truncatedName_track = track.name;
                                            if (track.name.length > 45) {
                                                truncatedName_track = track.name.substring(0, 45) + "...";
                                            }
                                            trackText.innerHTML = truncatedName_track;
                                            trackPhoto.src = track.album.images[0].url;
                                            trackLink.href = `https://open.spotify.com/track/${track.id}`;
                                            [trackText, trackPhoto, trackLink].forEach(el => el.classList.remove("hide"));

                                            isEmpty_tracks = false;
                                            document.querySelector(".missing-tracks-error").classList.add("hide");
                                        } else {
                                            trackText.innerHTML = "";
                                            trackPhoto.src = "";
                                            [trackText, trackPhoto, trackLink].forEach(el => el.classList.add("hide"));
                                        }
                                    }
                                    if (isEmpty_tracks) {
                                        document.querySelector(".missing-tracks-error").classList.remove("hide");
                                    }
                                    document.querySelector(".top-tracks").classList.remove("hide");
                                });
                                fetch('https://spotify-webapp-backend.onrender.com/get_artist_album')
                                .then(response => response.json())
                                .then(data => {
                                    const topAlbums = data.items.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 5);

                                    let isEmpty = true;
                    
                                    // Clear the previous artist's albums and display the top albums
                                    for (let i = 1; i <= 5; i++) {
                                        const albumText = document.getElementById(`album${i}-text`);
                                        const albumPhoto = document.getElementById(`album${i}-photo`);
                                        const albumLink = document.getElementById(`album-clickable-${i}`);
                                        const album = topAlbums[i - 1];
                    
                                        if (album) {
                                            let truncatedName = album.name;
                                            if (album.name.length > 45) {
                                                truncatedName = album.name.substring(0, 45) + "...";
                                            }
                                            albumText.innerHTML = truncatedName;
                                            albumPhoto.src = album.images[0].url;
                                            albumLink.href = `https://open.spotify.com/album/${album.id}`;
                                            [albumText, albumPhoto, albumLink].forEach(el => el.classList.remove("hide"));
                    
                                            isEmpty = false;
                                            document.querySelector(".missing-albums-error").classList.add("hide");
                                        } else {
                                            albumText.innerHTML = "";
                                            albumPhoto.src = "";
                                            [albumText, albumPhoto, albumLink].forEach(el => el.classList.add("hide"));
                                        }
                                    }
                                    if (isEmpty) {
                                        document.querySelector(".missing-albums-error").classList.remove("hide");
                                    }
                                    document.querySelector(".albums").classList.remove("hide");
                                })
                        });
                })
                .catch(error => {
                    document.getElementById("error-message").innerHTML = "Sorry, This Artist Is Unavailable";
                    return;
                });
            });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action of the "Enter" key
    
      // Find the button element you want to trigger
      var button = document.getElementById('search-button');
    
      if (button) {
        button.click(); // Trigger the click event on the button
      }
    }
});



function trashButton() {
    const input_b = document.getElementById("input-button");
    input_b.value = '';
}
