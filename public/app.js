document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("main-content");
    const scrollBox = document.getElementById("scroll-box");

    const _schools = {
        "oedi": ["2A", "2B", "2E", "2F", "3B", "3D", "3G", "4F", "P1", "P2", "2T"],
        "21er": ["1B", "1E", "1F", "3B", "3D", "4E", "4H"]
    };

    // We use this for changing data (chapters are mutable)
    let _chapters = null;
    // We use this for drawing
    let _chapterTree = null;
    let _user = null;
    let _login_token = null;
    let _loadingCnt = 0;
    let _scrollPosition = 0;

    // Routes and their corresponding content
    const routes = {
        home: "routes/home.html",
        chapter: "routes/chapter.html",
        profile: "routes/profile.html",
        faq: "routes/faq.html",
    };

    // Function to load a route
    async function loadRoute(route) {
        const [baseRoute] = route.split("?");
        const routeFile = routes[baseRoute] || routes["home"]; // Default to 'home' if route not found
        try {
            const response = await fetch(routeFile);
            if (!response.ok)
                throw new Error("Failed to load route.");
            content.innerHTML = await response.text(); // Inject the route content into the main container

            // Check if additional logic is needed for the route
            switch (baseRoute) {
                case "home":
                    showLoadingChapters();
                    await (async function () {
                        if (!_chapters) {
                            await loadChapters();
                            populateChapters();
                            await loadUser();
                            populateMenu();
                            await Promise.allSettled([
                                await loadChaptersFromWeb(),
                                await loadBulletin()
                            ]);
                        }
                        populateChapters();
                    }());
                    break;
                case "chapter":
                    await (async function () {
                        if (!_chapters) {
                            await loadChapters()
                            await loadChaptersFromWeb()
                        }
                        populateResource();
                    }());
                    break;
                case "profile":
                    await (async function () {
                        await loadUser();
                        populateProfile();
                    }());

                    break;
                default : {
                }
            }

            // Updates mdl components like spinner
            componentHandler.upgradeDom();
        } catch (error) {
            console.error("Error loading route:", error);
            showSnackbar(error.message);
        }
    }

    function showLoadingChapters() {
        const chapterContent = document.getElementById("chapter-content");
        const template = document.getElementById("chapter-item-template");

        // Clear the placeholder content
        chapterContent.innerHTML = "";

        for (let i = 0; i < 9; i++) {
            // Clone the template content
            const clone = template.content.cloneNode(true);

            clone.querySelector('.card-image').style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url("../src/placeholder.jpg")`;
            clone.querySelector('.card-title').textContent = `loading`;
            clone.querySelector('.card-description').textContent = `loading...`;

            // Append the populated clone to the container
            chapterContent.appendChild(clone);
        }
    }

    async function loadBulletin() {
        try {
            showSpinner(true)

            function isBulletinListEmpty() {
                return !bulletinList || bulletinList.length === 0
            }

            const bulletinResponse = await fetch(`${BASE_URL}/api/bulletin/?schoolId=${_user.schoolId}&className=${_user.className}`);
            if (!bulletinResponse.ok)
                throw new Error("Failed to fetch data.");
            const bulletinList = await bulletinResponse.json();

            const bulletinContainer = document.getElementById("bulletin");
            const bulletinTitle = document.getElementById("bulletin-title");

            bulletinContainer.style.display = isBulletinListEmpty() ? "none" : "block";
            bulletinTitle.style.display = isBulletinListEmpty() ? "none" : "block";

            const template = document.getElementById("bulletin-item-template");
            bulletinList.forEach(value => {
                const clone = template.content.cloneNode(true);
                clone.querySelector("p").innerHTML = value;
                bulletinContainer.appendChild(clone);
            });
        } catch (error) {
            console.error("Error fetching dynamic list data:", error);
            showSnackbar(error.message);
        } finally {
            showSpinner(false)
        }
    }

    function populateChapters() {
        const chapterContent = document.getElementById("chapter-content");
        const template = document.getElementById("chapter-item-template");
        const starMap = ["star_border", "star_half", "star"];

        // Clear the placeholder content
        chapterContent.innerHTML = "";

        // Populate the list dynamically
        Object.entries(_chapterTree).forEach(([year, chapters]) => {
            const yearTitle = document.createElement('h2');
            yearTitle.textContent = !isNaN(Number(year)) ? `${year}. Klasse` : year;
            yearTitle.className = "mdl-cell mdl-cell--12-col";
            chapterContent.appendChild(yearTitle);
            Object.entries(chapters)
                .filter(([_, value]) => !value.hidden)
                .forEach(([chapterId, chapter]) => {
                    // Clone the template content
                    const chapterNode = template.content.cloneNode(true);

                    // Populate the template with actual data
                    if (chapter.isActive) {
                        chapterNode.querySelector('.card').classList.add('active');
                        chapterNode.querySelector('.card').addEventListener("click", () => {
                            _scrollPosition = scrollBox.scrollTop;
                            navigate('chapter', chapterId);
                        });
                    }
                    if (_user && _user.isTeacher) {
                        chapterNode.querySelector('.card').style.cursor = 'pointer';
                        chapterNode.querySelector('.card').addEventListener("click", () => {
                            _scrollPosition = scrollBox.scrollTop;
                            navigate('chapter', chapterId);
                        });
                    }
                    chapterNode.querySelector('.card-image').style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url('${chapter.image ? chapter.image : "../src/placeholder.jpg"}')`;
                    chapterNode.querySelector('.card-title').textContent = `${chapter.name}`;
                    chapterNode.querySelector('.card-description').textContent = `${chapter.description}`;
                    chapterNode.querySelector('.card-star').textContent = starMap[chapter.star];

                    // Append the populated clone to the container
                    chapterContent.appendChild(chapterNode);
                });
        });

        scrollBox.scrollTo(0, _scrollPosition);
    }

    async function loadChapters() {
        // Fetch data from a REST API
        const chaptersResponse = await fetch("data/chapters.json"); // Example API
        if (!chaptersResponse.ok)
            throw new Error("Failed to fetch data.");

        _chapterTree = await chaptersResponse.json();

        // Merge to a 1 dimensional set of chapters and
        // Add `isVisible = false` to each chapter
        _chapters = Object.fromEntries(
            Object.entries(_chapterTree).flatMap(([classLevel, chapters]) =>
                Object.entries(chapters).map(([chapterName, chapter]) => {
                    chapter.classLevel = +classLevel;
                    chapter.isActive = false;
                    // chapter.isActive = +classLevel <= +_user.className[0] || +_user.className[0] === 5 || chapterName === 'program'; // modifies original object
                    chapter.star = null;
                    return [chapterName, chapter]; // keeps the reference
                })
            )
        );
    }

    // Function to fetch data from a REST API and populate the list
    async function loadChaptersFromWeb() {
        showSpinner(true);
        try {
            //const activeChaptersResponse = await fetch("data/activeChapters.json");
            const activeChaptersResponse = await fetch(`${BASE_URL}/api/chapters/?schoolId=${_user.schoolId}&className=${_user.className}`);
            if (!activeChaptersResponse.ok)
                throw new Error("Failed to fetch data.");
            const activeChapters = await activeChaptersResponse.json();

            // Filter out chapters whose id is not in activeChapters
//            if (!_user.isTeacher) {
//                chapters = Object.fromEntries(
//                        Object.entries(mergedChapters).filter(([key, chapter]) =>
//                    activeChapters[key] !== undefined)
//                        );
//            }

            // Set active chapters
            Object.entries(_chapters).forEach(([chapterName, chapter]) => {
                chapter.isActive = +chapter.classLevel <= +_user.className[0] || +_user.className[0] === 5 || chapterName === 'program'; // modifies original object
            })

            // Set star
            Object.entries(activeChapters).forEach(([chapterName, chapter]) => {
                if (!_chapters[chapterName]) {
                    const errorMsg = `Chapter ${chapterName} not found. Please fix in sheet!`;
                    console.error("Error fetching dynamic list data:", errorMsg);
                    showSnackbar(errorMsg);
                } else {
                    if (!_user.isTeacher) {
                        if (chapter.hasQuiz === true) {
                            _chapters[chapterName].star = !_user.chapters[chapterName] ? 0 : (_user.chapters[chapterName] >= 100 ? 2 : 1);
                        }
                    }
                }
            });
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
            slide: "auto_stories",
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

            if (entry.type === 'slide')
                entry.description = `Die Lernunterlagen zum Kapitel "${chapter.name}"`;
            else if (entry.type === 'quiz')
                entry.description = `Das Quiz zum Kapitel "${chapter.name}"`;

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
        document.getElementById("grade").textContent = `${_user.points === 0 ? "-" : _user.grade}`;
        document.getElementById("points").textContent = `${parseFloat(_user.points.toFixed(0))}`;
        document.getElementById("credits").textContent = `💎 ${_user.credits.toFixed(0)}`;
        document.getElementById("avatarImg").src = `img/avatar_${_user.avatar.g || 'f'}.png`;
        document.getElementById("stars").textContent = `★ ${Object.values(_user.chapters).filter(value => value > 100).length}`;
        // document.getElementById("extra").textContent = _user.hasExtra ? "☑✓" : "☐✘";
        document.getElementById("logout-btn").onclick = (e) => {
            document.cookie = `login_token=; path=/; max-age=0`;
            window.location.href = "routes/login.html";
        };
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
            window.location.href = "routes/login.html";
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

    function populateMenu() {
        const classMenuBtn = document.getElementById("classMenuBtn");
        classMenuBtn.hidden = !_user.isTeacher;
        document.getElementById("profileMenuBtn").hidden = _user.isTeacher;

        if (!_user.isTeacher)
            return;

        const menu = document.getElementById("classmenu");

        _login_token = getCookie('login_token');

        if (!_login_token) {
            throw new Error("No login token.");
        }

        const [schoolId, className, hash] = _login_token.split('|');
        classMenuBtn.textContent = `Class - ${schoolId} ${className}`;

        // Fetch JSON data asynchronously
        fetch('data/classMenu.json')
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                menu.innerHTML = "";
                Object.entries(jsonData).forEach(([schoolId, schoolObj]) => {
                    const ul = document.createElement("ul");
                    ul.className = "menu-class-list";
                    const li = document.createElement("li");
                    li.className = "mdl-menu__item";
                    li.style.fontWeight = "bold";
                    li.textContent = `${schoolId}`; // Display the value in the list
                    ul.appendChild(li);
                    schoolObj.forEach(className => {
                        const li = document.createElement("li");
                        li.className = "mdl-menu__item";
                        li.textContent = `${className}`; // Display the value in the list

                        // On click, store only the key in a cookie
                        li.addEventListener("click", () => {
                            const cookie = `${schoolId}|${className}|${hash}`;
                            document.cookie = `login_token=${cookie}; path=/; max-age=86400`; // 1 day
                            location.reload();
                        });

                        ul.appendChild(li);
                    });
                    menu.appendChild(ul);
                });

//                    jsonData.forEach(item => {
//                        const [schoolId, className] = item.split('|');
//                        const li = document.createElement("li");
//                        li.className = "mdl-menu__item";
//                        li.textContent = `${schoolId} ${className}`; // Display the value in the list
//
//                        // On click, store only the key in a cookie
//                        li.addEventListener("click", () => {
//                            const cookie = `${schoolId}|${className}|${hash}`;
//                            document.cookie = `login_token=${cookie}; path=/; max-age=86400`; // 1 day
//                            location.reload();
//                        });
//
//                        menu.appendChild(li);
//                    });
            })
            .catch(error => {
                console.error("Failed to load JSON data:", error);
            });
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

// Save scroll position before navigating away
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

// Restore scroll position when the page loads
window.addEventListener('load', () => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
    }
});
