<script>
    async function fetchFollowers() {
        const response = await fetch("https://api.github.com/users/yashKappa/followers?per_page=10");
        const followers = await response.json();
        const container = document.getElementById("followers");

        followers.forEach(follower => {
            const div = document.createElement("span");
            div.innerHTML = `<a href="${follower.html_url}" target="_blank">
                                <img src="${follower.avatar_url}" width="50" height="50" style="border-radius:50%; margin:5px;">
                                <br>${follower.login}
                             </a>`;
            div.style.display = "inline-block";
            div.style.textAlign = "center";
            div.style.margin = "10px";
            container.appendChild(div);
        });
    }

    fetchFollowers();
</script>
