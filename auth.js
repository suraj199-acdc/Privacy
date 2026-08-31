```javascript
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

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    const signupButton =
        document.getElementById("signupButton");

    const showPassword =
        document.getElementById("showPassword");

    const passwordInput =
        document.getElementById("password");


    /* Show / hide password */

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


    /* Signup */

    signupForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const displayName =
                document
                    .getElementById("displayName")
                    .value
                    .trim();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim()
                    .toLowerCase();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            /* Validation */

            if (!displayName) {

                showMessage(
                    "Please enter your display name.",
                    "error"
                );

                return;

            }


            if (!username) {

                showMessage(
                    "Please choose a username.",
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


            if (password.length < 6) {

                showMessage(
                    "Password must be at least 6 characters.",
                    "error"
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            signupButton.disabled = true;

            signupButton.textContent =
                "Creating account...";


            try {

                /* =====================================
                   CHECK USERNAME
                ===================================== */

                const {
                    data: existingUsername,
                    error: usernameError
                } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("username", username)
                    .maybeSingle();


                if (usernameError) {

                    throw usernameError;

                }


                if (existingUsername) {

                    throw new Error(
                        "That username is already taken."
                    );

                }


                /* =====================================
                   CREATE AUTH ACCOUNT
                ===================================== */

                const {
                    data,
                    error
                } = await supabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            username: username,

                            display_name: displayName

                        }

                    }

                });


                if (error) {

                    throw error;

                }


                if (!data.user) {

                    throw new Error(
                        "Account could not be created."
                    );

                }


                /* =====================================
                   SAVE EMAIL FOR OTP PAGE
                ===================================== */

                sessionStorage.setItem(
                    "privacy_verification_email",
                    email
                );


                /* =====================================
                   SUCCESS
                ===================================== */

                showMessage(
                    "Account created! Check your email for the verification code 💜",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "verify-otp.html";

                }, 900);


            } catch (error) {

                console.error(
                    "SIGNUP ERROR:",
                    error
                );


                showMessage(
                    error.message ||
                    "Something went wrong while creating your account.",
                    "error"
                );


                signupButton.disabled = false;

                signupButton.textContent =
                    "Create my Privacy account";

            }

        }
    );

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


    /* Show / hide password */

    if (showPassword) {

        showPassword.addEventListener(
            "click",
            () => {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    showPassword.textContent =
                        "🙈";

                } else {

                    passwordInput.type =
                        "password";

                    showPassword.textContent =
                        "👁️";

                }

            }
        );

    }


    /* =====================================
       LOGIN
    ===================================== */

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            if (!email || !password) {

                showMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }


            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";


            try {

                const {
                    data,
                    error
                } = await supabase.auth
                    .signInWithPassword({

                        email: email,

                        password: password

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

                }, 500);


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


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


    /* =====================================
       FORGOT PASSWORD
    ===================================== */

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                if (!email) {

                    showMessage(
                        "Enter your email address first.",
                        "error"
                    );

                    return;

                }


                try {

                    const {
                        error
                    } = await supabase.auth
                        .resetPasswordForEmail(
                            email,
                            {

                                redirectTo:
                                    window.location.origin +
                                    "/Privacy/reset-password.html"

                            }
                        );


                    if (error) {

                        throw error;

                    }


                    showMessage(
                        "Password reset email sent 💜",
                        "success"
                    );


                } catch (error) {

                    console.error(error);


                    showMessage(
                        error.message ||
                        "Unable to send password reset email.",
                        "error"
                    );

                }

            }
        );

    }

}
```
