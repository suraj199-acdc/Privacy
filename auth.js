import { supabase } from "./supabase-config.js";


/* =========================================
   HELPER
========================================= */

function showMessage(message, type) {

    const box = document.getElementById("message");

    if (!box) return;

    box.textContent = message;

    box.className = "message " + type;
}


/* =========================================
   SIGNUP
========================================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    const signupButton =
        document.getElementById("signupButton");

    const showPassword =
        document.getElementById("showPassword");

    const passwordInput =
        document.getElementById("password");


    if (showPassword) {

        showPassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                showPassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                showPassword.textContent = "👁️";

            }

        });

    }


    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const displayName =
            document.getElementById("displayName")
                .value.trim();

        const username =
            document.getElementById("username")
                .value.trim()
                .toLowerCase();

        const email =
            document.getElementById("email")
                .value.trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        if (!/^[a-zA-Z0-9_]+$/.test(username)) {

            showMessage(
                "Username can only contain letters, numbers and underscores.",
                "error"
            );

            return;
        }


        signupButton.disabled = true;

        signupButton.textContent =
            "Creating account...";


        try {

            /*
             * Check username first
             */

            const { data: existingUsername } =
                await supabase
                    .from("profiles")
                    .select("id")
                    .eq("username", username)
                    .maybeSingle();


            if (existingUsername) {

                throw new Error(
                    "That username is already taken."
                );

            }


            /*
             * Create Supabase Auth account
             */

            const { data, error } =
                await supabase.auth.signUp({

                    email,
                    password

                });


            if (error) {

                throw error;

            }


            const user = data.user;


            if (!user) {

                throw new Error(
                    "Account creation failed."
                );

            }


            /*
             * Create profile
             */

            const { error: profileError } =
                await supabase
                    .from("profiles")
                    .insert({

                        id: user.id,

                        username,

                        display_name: displayName

                    });


            if (profileError) {

                console.error(profileError);

                throw new Error(
                    "Account created but profile setup failed."
                );

            }


            /*
             * Check whether Supabase gave us
             * an active session.
             */

            if (data.session) {

                showMessage(
                    "Account created! Opening Privacy...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1000);

            } else {

                showMessage(
                    "Account created! Check your email to confirm your account.",
                    "success"
                );


                signupButton.disabled = false;

                signupButton.textContent =
                    "Create my Privacy account";

            }


        } catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Something went wrong.",
                "error"
            );


            signupButton.disabled = false;

            signupButton.textContent =
                "Create my Privacy account";

        }

    });

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    const loginButton =
        document.getElementById("loginButton");

    const showPassword =
        document.getElementById("showPassword");

    const passwordInput =
        document.getElementById("password");


    /*
     * Show / hide password
     */

    if (showPassword) {

        showPassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                showPassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                showPassword.textContent = "👁️";

            }

        });

    }


    /*
     * Login
     */

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document.getElementById("email")
                    .value.trim();

            const password =
                document.getElementById("password")
                    .value;


            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";


            try {

                const { data, error } =
                    await supabase.auth.signInWithPassword({

                        email,

                        password

                    });


                if (error) {

                    throw error;

                }


                if (!data.session) {

                    throw new Error(
                        "Login session could not be created."
                    );

                }


                showMessage(
                    "Login successful! Welcome back 💜",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } catch (error) {

                console.error(error);

                showMessage(
                    error.message ||
                    "Login failed.",
                    "error"
                );


                loginButton.disabled = false;

                loginButton.textContent =
                    "Log in";

            }

        }
    );


    /*
     * Forgot password
     */

    const forgotPassword =
        document.getElementById("forgotPassword");


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();


                const email =
                    document.getElementById("email")
                        .value.trim();


                if (!email) {

                    showMessage(
                        "Enter your email address first.",
                        "error"
                    );

                    return;

                }


                try {

                    const { error } =
                        await supabase.auth
                            .resetPasswordForEmail(
                                email,
                                {
                                    redirectTo:
                                        window.location.origin +
                                        "/reset-password.html"
                                }
                            );


                    if (error) {

                        throw error;

                    }


                    showMessage(
                        "Password reset email sent.",
                        "success"
                    );


                } catch (error) {

                    showMessage(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}