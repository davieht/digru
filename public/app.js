document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("main-content");
    const isTeacher = true;
    
    const schools = {
        "oedi": ["1A", "1B", "1E", "1F", "2B", "2D", "2G", "3F", "4E", "4H"],
        "21er": ["1B", "1E", "1F", "3B", "3D", "4E", "4H"]
    };

    let _chapters = null;
    let _user = null;
    let _login_token = null;
    let _loadingCnt = 0;

    // Routes and their corresponding content
    const routes = {
        home: "routes/home.html",
        chapter: "routes/chapter.html",
        profile: "routes/profile.html",
    };

    const BASE_URL = "http://localhost:3000";

    // Function to load a route
    async function loadRoute(route) {
        const [baseRoute] = route.split("?");
        const routeFile = routes[baseRoute] || routes["home"]; // Default to 'home' if route not found
        try {
            const response = await fetch(routeFile);
            if (!response.ok)
                throw new Error("Failed to load route.");
            const html = await response.text();
            content.innerHTML = html; // Inject the route content into the main container

            // Check if additional logic is needed for the route
            switch (baseRoute) {
                case "home":
                    (async function () {
                        if (!_chapters) {
                            await loadUser();
                            await loadChapters();
                        }
                        populateChapters();
                    }());
                    break;
                case "chapter":
                    (async function () {
                        if (!_chapters) {
                            await loadChapters();
                        }
                        populateResource();
                    }());
                    break;
                case "profile":
                    (async function () {
                        await loadUser();
                        populateProfile();
                    }());

                    break;
                default :
                {
                }
            }

            // Updates mdl components like spinner
            componentHandler.upgradeDom();
        } catch (error) {
            console.error("Error loading route:", error);
            showSnackbar(error.message);
        }
    }

    async function populateChapters() {
        const listContainer = document.getElementById("main-content");
        const template = document.getElementById("chapter-item-template");
        const starMap = ["star_border", "star_half", "star"];

        // Clear the placeholder content
        listContainer.innerHTML = "";

        // Populate the list dynamically
        Object.entries(_chapters).forEach(([chapterId, chapter]) => {
            // Clone the template content
            const clone = template.content.cloneNode(true);

            // Populate the template with actual data
            if (chapter.isActive) {
                clone.querySelector('.card').classList.add('active');
                clone.querySelector('.card').addEventListener("click", () => {
                    navigate('chapter', chapterId);
                });
            }
            if (isTeacher) {
                clone.querySelector('.card').style.cursor = 'pointer';
                clone.querySelector('.card').addEventListener("click", () => {
                    navigate('chapter', chapterId);
                });
            }
            clone.querySelector('.card-image').style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url('${chapter.image ? chapter.image : "../src/placeholder.jpg"}')`;
            clone.querySelector('.card-title').textContent = `${chapter.name}`;
            clone.querySelector('.card-description').textContent = `${chapter.description}`;
            clone.querySelector('.card-star').textContent = starMap[chapter.star];

            // Append the populated clone to the container
            listContainer.appendChild(clone);
        });
    }

    // Function to fetch data from a REST API and populate the list
    async function loadChapters() {
        showSpinner(true);
        try {
            // Fetch data from a REST API
            const chaptersResponse = await fetch("data/chapters.json"); // Example API
            if (!chaptersResponse.ok)
                throw new Error("Failed to fetch data.");

            let chapters = await chaptersResponse.json();

            // Add `isVisible = false` to each chapter
            chapters = Object.fromEntries(
                    Object.entries(chapters).map(([key, chapter]) => [
                    key,
                    {...chapter, isActive: false, star: null}
                ]));

            //const activeChaptersResponse = await fetch("data/activeChapters.json");
            const activeChaptersResponse = await fetch(`${BASE_URL}/api/chapters/?schoolId=${_user.schoolId}&className=${_user.className}`);
            if (!activeChaptersResponse.ok)
                throw new Error("Failed to fetch data.");
            const activeChapters = await activeChaptersResponse.json();


            // Filter out chapters whose id is not in activeChapters
            if (!isTeacher) {
                chapters = Object.fromEntries(Object.entries(chapters).filter(([key, chapter]) =>
                    activeChapters[key] !== undefined)
                        );
            }

            // Set chapters isActive and star
            Object.entries(activeChapters).forEach(([chapterName, isActive]) => {
                if (!chapters[chapterName]) {
                    throw new Error(`Chapter '${chapterName}' not available`);
                }
                chapters[chapterName].isActive = isActive;

                if (!isTeacher) {
                    chapters[chapterName].star = _user.chapters[chapterName] == null ? 0 : (_user.chapters[chapterName] > 100 ? 2 : 1);
            }
            });

            _chapters = chapters;
        } catch (error) {
            console.error("Error fetching dynamic list data:", error);
            showSnackbar(error.message);
        } finally {
            showSpinner(false);
        }
    }

    function populateResource() {
        const iconmap = {
            video: "live_tv",
            interactive: "extension",
            pdf: "picture_as_pdf",
            link: "link",
            quiz: "checklist",
            exercise: "edit_square",
            slide: "save",
            download: "download"
        };

        const container = document.getElementById("chapter-list");
        const template = document.getElementById("resource-item-template");
        const title = document.getElementById("chapter-title");

        // Extract the query string part of the hash (after the "?")
        const params = new URLSearchParams(location.hash.split("?")[1]);

        // Retrieve parameter values
        const id = params.get("id");
        const chapter = _chapters[id];

        title.textContent = chapter.name;

        const listContainer = document.createElement("ul");

        listContainer.id = "link-container";
        listContainer.className = "demo-list-three mdl-list";

        chapter.links.forEach((entry) => {
            // Clone the template content
            const clone = template.content.cloneNode(true);
            const icon = iconmap[entry.type];

            // Populate the template with actual data
            clone.querySelector('.resource').addEventListener("click", () => {
                const link = (entry.type === 'quiz')
                        ? `${entry.link}&schoolId=${_user.schoolId}&className=${_user.className}&firstName=${_user.firstName}&lastName=${_user.lastName}`
                        : entry.link;
                window.open(`${link}`, '_blank');
            });

            clone.querySelector('.resource-icon').textContent = `${icon}`;
            clone.querySelector('.resource-title').textContent = `${entry.name}`;
            clone.querySelector('.resource-description').textContent = `${entry.description}`;

            // Append the populated clone to the container
            listContainer.appendChild(clone);
        });
        container.appendChild(listContainer);
    }

    function populateProfile() {
        document.getElementById("profile-card").hidden = false;
        document.getElementById("username").textContent = `${_user.firstName} ${_user.lastName} - ${_user.className}`;
        document.getElementById("grade").textContent = `${_user.grade}`;
        document.getElementById("points").textContent = `${parseFloat(_user.points.toFixed(0))}`;
        document.getElementById("credits").textContent = `💎 ${_user.credits}`;
    }

    function navigate(destination, id) {
        location.hash = `#${destination}?id=${id}`;
    }

    async function loadUser() {
        showSpinner(true);
        try {
            _login_token = getCookie('login_token');

            if (!_login_token) {
                // Redirect to index.html
                throw new Error("No login token.");
            }

            const [schoolId, className, hash] = _login_token.split('|');

            // const chaptersResponse = await fetch("data/user.json");
            const userResponse = await fetch(`${BASE_URL}/api/user/?schoolId=${schoolId}&className=${className}&hash=${hash}`);
            if (!userResponse.ok)
                throw new Error("Failed to fetch data.");

            _user = await userResponse.json();

            if (!_user) {
                // Redirect to index.html
                throw new Error("No user.");
            }

            _user.schoolId = schoolId;
        } catch (error) {
            console.error("Error fetching user data:", error);
            //window.location.href = "routes/login.html";
            return;
        } finally {
            showSpinner(false);
        }
    }

    function showSpinner(show) {
        const spinner = document.getElementById("spinner");
        if (show) {
            if (_loadingCnt === 0) {
                spinner.classList.add("is-active");
            }
            _loadingCnt++;
        } else {
            _loadingCnt--;
            if (!_loadingCnt) {
                spinner.classList.remove("is-active");
            }
        }
    }

    // Event listener for hash changes
    window.addEventListener("hashchange", () => {
        const route = location.hash.slice(1) || "home"; // Get route from hash
        loadRoute(route);
    });

    // Initial render
    const initialRoute = location.hash.slice(1) || "home";
    loadRoute(initialRoute);
});
