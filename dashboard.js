import { supabase } from "./supabase-config.js";


let currentUser = null;


/* =========================================
   CHECK LOGIN
========================================= */

async function checkUser() {

    const {
        data,
        error
    } = await supabase.auth.getSession();


    if (error) {

        console.error(error);

        window.location.href = "login.html";

        return;

    }


    const session = data.session;


    if (!session) {

        window.location.href = "login.html";

        return;

    }


    currentUser = session.user;


    await loadProfile();

}


/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile() {

    const {
        data: profile,
        error
    } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();


    if (error) {

        console.error(error);

        return;

    }


    document.getElementById(
        "displayName"
    ).textContent =
        profile.display_name || "there";


    document.getElementById(
        "profileName"
    ).textContent =
        profile.display_name || "User";


    document.getElementById(
        "profileUsername"
    ).textContent =
        "@" + profile.username;

}


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById("logoutButton")
    .addEventListener("click", async () => {

        await supabase.auth.signOut();

        window.location.href =
            "login.html";

    });


/* =========================================
   PROFILE
========================================= */

document
    .getElementById("profileButton")
    .addEventListener("click", () => {

        window.location.href =
            "profile.html";

    });


/* =========================================
   SETTINGS
========================================= */

document
    .getElementById("settingsButton")
    .addEventListener("click", () => {

        window.location.href =
            "settings.html";

    });


/* =========================================
   CREATE CHAT
========================================= */

document
    .getElementById("createChatButton")
    .addEventListener("click", () => {

        alert(
            "Private chat creation is coming in the next step 💜"
        );

    });


/* =========================================
   JOIN CHAT
========================================= */

document
    .getElementById("joinChatButton")
    .addEventListener("click", () => {

        const code =
            prompt(
                "Enter your private invitation code:"
            );


        if (!code) return;


        alert(
            "We'll connect you to invitation: " +
            code
        );

    });


/* =========================================
   START
========================================= */

checkUser();